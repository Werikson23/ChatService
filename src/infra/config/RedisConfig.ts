export class RedisConfig {
  static readonly url = process.env.REDIS_URL ?? 'redis://localhost:6379';
}
