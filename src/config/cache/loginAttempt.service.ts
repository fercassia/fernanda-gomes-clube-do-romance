import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";

@Injectable()
export class LoginAttemptService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private TIME_NOW: number;

  async getAttempts(cacheKey: string): Promise<number> {
    const attempts = await this.cacheManager.get<number>(cacheKey);
    if (attempts === undefined) {
      return 0;
    }
    return attempts;
  }

  async getTtl(cacheKey: string): Promise<number> {
    const time = await this.cacheManager.ttl(cacheKey);
    if(time === undefined || time === null || time < 0){
      return 0;
    } 
    return time;
  }

  convertTtlToMinutes(ttl: number): number {
    if (ttl === 0) {
      return ttl;
    }
    const value = ttl - this.TIME_NOW;
    return Math.floor((value / 1000));
  }
  async incrementAttempts(cacheKey: string, maxAttempts: number): Promise<{ attempts: number, remaining: number, isBlocked: boolean , retryAfterMinutes?: number }> {
    const currentAttempts = await this.getAttempts(cacheKey);
    const attempts = currentAttempts + 1;

    if (attempts >= maxAttempts) {
      this.TIME_NOW = new Date().getTime();
      await this.cacheManager.set(cacheKey, attempts);
      const ttlConverted = this.convertTtlToMinutes(await this.getTtl(cacheKey));
      return { attempts, remaining: 0, isBlocked: true, retryAfterMinutes: ttlConverted  };
    }
    await this.cacheManager.set(cacheKey, attempts);
    const remaining = maxAttempts - attempts;
    return { attempts, remaining: remaining, isBlocked: false };
  }
}