import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LoginFailureInterceptor implements NestInterceptor {
  private readonly BLOCKED_TIME: number = 7200; //2 horas

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

          Logger.warn(`${HttpStatus.UNAUTHORIZED} - Login failure attempt from IP ${ip}. Attempt number: ${attempts}.`, );
          await this.cacheManager.set(cacheKey, attempts, this.BLOCKED_TIME);
        }
        return throwError(() => error);
      }));
  }
}