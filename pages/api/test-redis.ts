// pages/api/test-redis.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Set a test key
    await redis.set('test-key', 'It works!');
    // ✅ Get the test key
    const value = await redis.get('test-key');

    res.status(200).json({ success: true, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
