import { redisClient } from './redisClient';

export class RedisCache {
  /**
   * 🔍 Busca valor no cache
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (err) {
      console.error(`❌ RedisCache.get falhou [${key}]`, err);
      return null; // cache nunca pode derrubar o sistema
    }
  }

  /**
   * 💾 Salva valor no cache
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);

      if (ttlSeconds && ttlSeconds > 0) {
        await redisClient.set(key, data, 'EX', ttlSeconds);
      } else {
        await redisClient.set(key, data);
      }
    } catch (err) {
      console.error(`❌ RedisCache.set falhou [${key}]`, err);
      // engole erro de cache (fail-safe)
    }
  }

  /**
   * 🧹 Remove chave do cache
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error(`❌ RedisCache.del falhou [${key}]`, err);
    }
  }

  /**
   * 🔁 Cache com fallback automático (cache-aside)
   * NÃO quebra nada existente, só adiciona poder
   */
  async remember<T>(
    key: string,
    ttlSeconds: number,
    resolver: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const fresh = await resolver();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
}
