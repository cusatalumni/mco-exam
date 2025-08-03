import { Redis } from '@upstash/redis';

// Make the connection logic more robust by checking for Vercel's KV variables first,
// then falling back to direct Upstash variables.
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    throw new Error('Redis connection credentials (e.g., KV_REST_API_URL, UPSTASH_REDIS_REST_URL) are not set in environment variables.');
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// A common practice is to use a secure, known environment variable for JWT signing.
// We'll use the Redis token here for simplicity and to reduce configuration points,
// assuming it's set securely in the environment. For enterprise-grade security,
// a dedicated, separately generated JWT secret is recommended.
export const jwtSecret = redisToken;
