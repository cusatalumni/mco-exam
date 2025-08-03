import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await redis.set('foo', 'bar');
  const value = await redis.get('foo');
  res.status(200).json({ value });
}
