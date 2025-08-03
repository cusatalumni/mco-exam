import { Redis } from '@upstash/redis';

// Use the specific environment variables for Upstash Redis as provided by the Vercel integration.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in the Vercel project environment variables.');
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