import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LoginFailureInterceptor implements NestInterceptor {
  private readonly BLOCKED_TIME: number = 7200; //2 horas
  private readonly MAX_ATTEMPTS: number = 5;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  intercept(context: ExecutionContext, next: CallHandler ): Observable<any>{
    return next.handle().pipe(
      catchError(async (error) => {
        if (error.status === HttpStatus.UNAUTHORIZED) {
          const request = context.switchToHttp().getRequest();
          const ip = request.ip;
          const cacheKey = `login_attempts_${ip}`;
          let attempts = await this.cacheManager.get<number>(cacheKey) || 0;
          attempts++;

          const remainingAttempts = Math.max(this.MAX_ATTEMPTS - attempts, 0);

          if (attempts >= this.MAX_ATTEMPTS) {
            Logger.error(`${HttpStatus.TOO_MANY_REQUESTS} - IP ${ip} has been blocked due to too many failed login attempts.`, );
            await this.cacheManager.set(cacheKey, attempts, this.BLOCKED_TIME);
            return throwError(() => new HttpException({
              message: 'Too many login attempts. Please try again later.',
              remainingAttempts: 0,
              retryAfter: this.cacheManager.ttl(cacheKey)}, 
              HttpStatus.TOO_MANY_REQUESTS
            ));
          }

          return throwError(() => new HttpException({
            message: 'Invalid Email or Password.',
            remainingAttempts: remainingAttempts,
          }, HttpStatus.UNAUTHORIZED));
        }
        return throwError(() => error);
      }));
  }
}