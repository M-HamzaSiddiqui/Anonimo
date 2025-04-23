import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis, connectRedis } from "./redis";

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? 'prod_login_fail_ip' : 'dev_login_fail_ip';

let loginLimiter: RateLimiterRedis | null = null;

export const getLimiter = async () => {
  await connectRedis();
  if (!loginLimiter) {
    loginLimiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: prefix,
      points: 3,
      duration: 300,
      blockDuration: 3600,
    });
  }
  return loginLimiter;
};

export async function rateLimitter(ip: string) {
  try {
    const limiter = await getLimiter()
    console.log("Limiter consuming", ip)
    const result = await limiter.consume(ip, 1)
    console.log("limiter result", result)
    await redis.quit()
    return { success: true };
  } catch (error) {
    console.error(`Rate limiting triggered for key: ${ip}`);
    await redis.quit()
    return { success: false };
  }
}
