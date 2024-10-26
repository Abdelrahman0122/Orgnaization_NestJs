import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CONNECTION') private readonly redis: Redis) {}

  async set(key: string, value: any): Promise<'OK'> {
    return this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

}
