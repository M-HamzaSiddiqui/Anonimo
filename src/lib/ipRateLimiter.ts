import { RateLimiterRedis } from "rate-limiter-flexible";
import { connectRedis } from "./redis";

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? 'prod_login_fail_ip' : 'dev_login_fail_ip';

export async function rateLimitter(key: string) {
  const redis = await connectRedis(); // Always ensure connected

  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: prefix,
    points: 3,
    duration: 300,
    blockDuration: 3600,
  });

  const fullKey = `rate-limiter-flexible:${prefix}:${key}`;
  console.log("🔐 Redis rate-limit key:", fullKey);

  try {
    const result = await limiter.consume(key, 1);
    console.log("✅ Rate limiter OK:", key, "| Remaining:", result.remainingPoints);
    return { success: true, remaining: result.remainingPoints };
  } catch (error: any) {
    console.warn("⛔ Rate limiter BLOCKED:", key, "| msBeforeNext:", error.msBeforeNext);
    return { success: false, retryAfter: error.msBeforeNext };
  }
}
