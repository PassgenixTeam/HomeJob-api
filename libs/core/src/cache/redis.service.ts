import { Redis } from 'ioredis';
import { RedisConfig } from './redis.interface';

export class RedisService {
  private redis: Redis;

  constructor(config: RedisConfig) {
    if (config) {
      const { host, port, password } = config;
      this.redis = new Redis({
        host,
        port: +port,
        password,
      });

      this.redis.on('connect', () => {
        console.log('Redis connected');
      });

      this.redis.on('error', (error) => {
        console.log('Redis error', error);
      });

      this.redis.on('close', () => {
        console.log('Redis connection closed');
      });
    }
  }

  /**
   * Gets the value associated with the specified key from Redis.
   *
   * @param key - The key to retrieve from Redis.
   * @returns The value associated with the specified key from Redis.
   */
  async get(key: string) {
    return this.redis.get(key);
  }

  /**
   * Sets the value associated with the specified key in Redis.
   *
   * @param key - The key to set in Redis.
   * @param value - The value to set for the specified key in Redis.
   * @param expire - (optional) The expiration time (in seconds) for the specified key in Redis.
   * @returns A boolean indicating whether the operation was successful.
   */
  async set(key: string, value: string, expire?: number) {
    await this.redis.set(key, value);
    if (expire) {
      await this.redis.expire(key, expire);
    }

    return true;
  }

  /**
   * Updates the value associated with the specified key in Redis by merging with the existing data.
   *
   * @param key - The key to update in Redis.
   * @param value - The value to merge with the existing data for the specified key in Redis.
   * @returns A boolean indicating whether the operation was successful.
   */
  async update(key: string, value: string) {
    const dataString = await this.redis.get(key);

    if (dataString) {
      const data = JSON.parse(dataString);
      value = JSON.stringify({ ...data, ...JSON.parse(value) });
    }

    await this.redis.set(key, value);

    const expireOld = await this.redis.ttl(key);

    if (expireOld > 0) {
      await this.redis.expire(key, expireOld);
    }

    return true;
  }

  /**
   * Deletes the value associated with the specified key from Redis.
   *
   * @param key - The key to delete from Redis.
   * @returns A boolean indicating whether the operation was successful.
   */
  async del(key: string) {
    return this.redis.del(key);
  }
}
