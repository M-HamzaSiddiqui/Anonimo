import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";

export const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "login_fail_ip",
  points: 3, //
  duration: 300,
  blockDuration: 3600,
});

export async function rateLimitter(ip: string) {
  try {
    await loginLimiter.consume(ip, 1);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
