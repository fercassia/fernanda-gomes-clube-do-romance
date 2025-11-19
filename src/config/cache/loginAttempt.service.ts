import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { CACHE_KEYS } from "../../shared/constants/cacheKeys";

@Injectable()
export class LoginAttemptService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private TIME_NOW: number;
  readonly CacheKey: string = CACHE_KEYS.LOGIN_ATTEMPTS;

  getCacheKey(ip: string): string {
    return `${this.CacheKey}${ip}`;
  }

  async getAttempts(ip: string): Promise<number> {
    return (await this.cacheManager.get<number>(this.getCacheKey(ip))) ?? 0;
  }

  async getTtl(ip: string): Promise<number> {
    const time = (await this.cacheManager.ttl(this.getCacheKey(ip))) ?? 0;

    if(time < 0){
      return 0;
    } 
    return time;
  }

  convertTtlToMinutes(ttl: number): number {
    if (ttl === 0) {
      return ttl;
    }
    const value = ttl - this.TIME_NOW;
    return Math.floor((value / 1000) / 60);
  }

  async incrementAttempts(ip: string, maxAttempts: number): Promise<{ attempts: number, remaining: number, isBlocked: boolean , retryAfterMinutes?: number }> {
    const currentAttempts = await this.getAttempts(ip);
    const attempts = currentAttempts + 1;

    if (attempts >= maxAttempts) {
      this.TIME_NOW = new Date().getTime();
      await this.cacheManager.set(this.getCacheKey(ip), attempts);
      const ttlConverted = this.convertTtlToMinutes(await this.getTtl(ip));
      return { attempts, remaining: 0, isBlocked: true, retryAfterMinutes: ttlConverted  };
    }
    await this.cacheManager.set(this.getCacheKey(ip), attempts);
    const remaining = maxAttempts - attempts;
    return { attempts, remaining: remaining, isBlocked: false };
  }
}