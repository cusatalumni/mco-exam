import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { redis } from '@/services/redis';
import type { TestResult, User } from '@/types';

interface TokenPayload {
    user: User;
    iat: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { testId } = req.query;
    if (!testId || typeof testId !== 'string') {
        return res.status(400).json({ message: 'Test ID is required' });
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

        const result = await redis.hgetall<TestResult>(`result:${testId}`);

        if (!result) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        
        // Security check: Ensure the fetched result belongs to the authenticated user
        if (result.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        return res.status(200).json(result);

    } catch (error) {
        console.error(`Error fetching result ${testId}:`, error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}