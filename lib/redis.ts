// lib/redis.ts
import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set.');
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
