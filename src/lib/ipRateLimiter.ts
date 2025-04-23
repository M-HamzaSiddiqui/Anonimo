// ipratelimitter.ts
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";  // Import the Redis client from redis.ts
import Redis from 'ioredis'

// Ensure redis is an instance of ioredis (or compatible client)
if (!(redis instanceof Redis)) {
  console.error("Redis client is not an instance of Redis.");
}

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? 'prod_login_fail_ip' : 'dev_login_fail_ip';

// Create limiter once and reuse
const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: prefix,
  points: 3,            // Max 3 requests
  duration: 300,        // Duration in seconds (5 minutes)
  blockDuration: 3600,  // Block for 1 hour after rate limit is exceeded
});

export async function rateLimitter(key: string) {
  const fullKey = `rate-limiter-flexible:${prefix}:${key}`;

  try {
    const result = await limiter.consume(key, 1);  // Consume 1 point per request
    return { success: true, remaining: result.remainingPoints };
  } catch (error: any) {
    console.warn("⛔ Rate limiter BLOCKED:", key, "| msBeforeNext:", error.msBeforeNext);

    // Log the full error object for better debugging
    console.error("🔥 Full error object:", error);

    return { success: false, retryAfter: error.msBeforeNext };
  }
}
