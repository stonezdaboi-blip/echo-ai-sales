import redis, { Redis } from 'redis';

export class CacheManager {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = redis.createClient({ url: redisUrl });
    this.client.on('error', err => console.error('Redis Error:', err));
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const options = ttlSeconds ? { EX: ttlSeconds } : {};
    await this.client.set(key, JSON.stringify(value), options);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushAll();
  }

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const value = await fn();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  async incrementCounter(key: string, ttlSeconds: number = 3600): Promise<number> {
    const current = await this.client.incr(key);
    if (current === 1) {
      await this.client.expire(key, ttlSeconds);
    }
    return current;
  }
}
