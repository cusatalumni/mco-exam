import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redis } from '../../services/redis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const pingResponse = await redis.ping();
        if (pingResponse === 'PONG') {
            return res.status(200).json({ status: 'ok', message: 'Successfully connected to the database.' });
        } else {
            throw new Error('Unexpected response from Redis ping.');
        }
    } catch (error: any) {
        console.error("Database health check failed:", error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Failed to connect to the database.', 
            error: error.message 
        });
    }
}
