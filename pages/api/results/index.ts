import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { redis } from '../../services/redis';
import type { TestResult, User } from '../../types';

interface TokenPayload {
    user: User;
    iat: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ANNAPOORNA_JWT_SECRET_KEY;

    if (!secret) {
        console.error("JWT secret key is not configured on the server.");
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        const userId = decoded.user.id;

        const resultIds = await redis.smembers(`user:${userId}:results`);
        if (!resultIds || resultIds.length === 0) {
            return res.status(200).json([]);
        }

        const pipeline = redis.pipeline();
        resultIds.forEach(id => pipeline.hgetall(`result:${id}`));
        const resultsData = await pipeline.exec<TestResult[]>();

        const results = resultsData
            .filter(r => r !== null)
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        return res.status(200).json(results);

    } catch (error) {
        console.error("Error fetching results:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}