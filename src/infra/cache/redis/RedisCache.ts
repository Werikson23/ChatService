import { redisClient } from './redisClient';

export class RedisCache {
  async get(key: string) {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.set(key, data, 'EX', ttlSeconds);
    } else {
      await redisClient.set(key, data);
    }
  }

  async del(key: string) {
    await redisClient.del(key);
  }
}
