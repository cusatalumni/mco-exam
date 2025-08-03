// pages/api/test-redis.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await redis.set('foo', 'bar');
    const value = await redis.get('foo');
    res.status(200).json({ success: true, value });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
