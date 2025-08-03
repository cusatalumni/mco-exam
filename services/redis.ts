import { Redis } from '@upstash/redis';

// Use the Vercel KV environment variables, which are automatically provided by the integration.
const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
    throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set in the Vercel project environment variables.');
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