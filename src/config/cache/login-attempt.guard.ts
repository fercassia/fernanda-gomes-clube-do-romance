import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LoginAttemptGuard implements CanActivate {
  private readonly MAX_ATTEMPTS: number = 5;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    
    const cacheKey = `login_attempts_${ip}`;
    const attempts = await this.cacheManager.get<number>(cacheKey);

    if (attempts && attempts >= this.MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}