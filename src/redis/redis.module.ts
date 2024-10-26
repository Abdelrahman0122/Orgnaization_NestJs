import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service'; // Create this service as well
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),     
          password: configService.get<string>('REDIS_PASSWORD'),   
        });
      },
      inject: [ConfigService],
    },
    RedisService, // Include the RedisService
  ],
  exports: ['REDIS_CONNECTION', RedisService],
})
export class RedisModule {}
