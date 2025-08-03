// /pages/api/some-api.ts
import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  const value = await redis.get('foo');
  res.status(200).json({ value });
}
