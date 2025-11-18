import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginAttemptService } from './loginAttempt.service';

@Injectable()
export class LoginFailureInterceptor implements NestInterceptor {
  readonly MAX_ATTEMPTS: number = 6;

  constructor(private loginAttemptService: LoginAttemptService) {}
  intercept(context: ExecutionContext, next: CallHandler ): Observable<any>{
    return next.handle().pipe(
      catchError((error) => {
        if (error.status === HttpStatus.UNAUTHORIZED) {
          const request = context.switchToHttp().getRequest();
          const ip = request.ip;
  
          return from(this.handleFailedAttempt(ip, error));
        }
        return throwError(() => error);
      }));
  }

  private async handleFailedAttempt(ip: string, originalError: any): Promise<void> {
    const result = await this.loginAttemptService.incrementAttempts(ip, this.MAX_ATTEMPTS);

    if (result.isBlocked) {
      Logger.error(`${HttpStatus.TOO_MANY_REQUESTS} - IP ${ip} has been blocked. LoginFailureInterceptor.`, );
      throw new HttpException({
              message: 'Too many login attempts. Please try again later.',
              remainingAttempts: 0,
              retryAfterMinutes: result.retryAfterMinutes,
            }, 
            HttpStatus.TOO_MANY_REQUESTS
        );
    }

    throw new HttpException({
      path: originalError.path,
      message: originalError.message,
      remainingAttempts: result.remaining,
    }, originalError.status);
  }
}