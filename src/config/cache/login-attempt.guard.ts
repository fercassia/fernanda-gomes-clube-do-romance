import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { LoginAttemptService } from './loginAttempt.service';

@Injectable()
export class LoginAttemptGuard implements CanActivate {

  readonly MAX_ATTEMPTS: number = 6;

  constructor(private readonly loginAttemptService: LoginAttemptService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    
    const cacheKey = `login_attempts_${ip}`;
    const attempts = await this.loginAttemptService.getAttempts(cacheKey);

    if (attempts && attempts >= this.MAX_ATTEMPTS) {
      const ttl = this.loginAttemptService.convertTtlToMinutes(await this.loginAttemptService.getTtl(cacheKey));
      Logger.error(`${HttpStatus.TOO_MANY_REQUESTS} - IP ${ip} has been blocked - LoginAttemptGuard`, );
      throw new HttpException(
        { 
          message: 'Too many login attempts. Please try again later.' ,
          remainningAttempts: 0,
          retryAfterMinutes: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}