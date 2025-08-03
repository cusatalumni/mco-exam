import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { redis, jwtSecret } from '../../../services/redis';
import type { TestResult, TokenPayload } from '../../../types';

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
    const secret = jwtSecret; // Use the standardized secret from the redis service

    try {
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenPayload;
        const userId = decoded.user.id;

        const resultIds = await redis.smembers(`user:${userId}:results`);
        if (!resultIds || resultIds.length === 0) {
            return res.status(200).json([]);
        }

        const pipeline = redis.pipeline();
        resultIds.forEach(id => pipeline.hgetall(`result:${id}`));
        const resultsData = await pipeline.exec();

        const results = resultsData
            .map(r => r as Record<string, unknown> | null)
            .filter((r): r is Record<string, unknown> => r !== null)
            .map(r => ({
                testId: r.testId as string,
                userId: r.userId as string,
                examId: r.examId as string,
                score: Number(r.score),
                correctCount: Number(r.correctCount),
                totalQuestions: Number(r.totalQuestions),
                timestamp: Number(r.timestamp),
                answers: JSON.parse(r.answers as string),
                review: JSON.parse(r.review as string)
            } as TestResult))
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
