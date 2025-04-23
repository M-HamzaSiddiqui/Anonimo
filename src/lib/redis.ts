import Redis from 'ioredis'

// Ensure correct Redis connection setup
export const redis = new Redis({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    host: 'redis-13054.c73.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 13054
})

redis.on("connect", () => {
  console.log("Connected to Redis server.");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});


