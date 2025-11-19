import {
  Injectable,
  CanActivate,
  ExecutionContext,
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
      
    const attempts = await this.loginAttemptService.getAttempts(ip);

    if (attempts && attempts >= this.MAX_ATTEMPTS) {
      const ttl = this.loginAttemptService.convertTtlToMinutes(await this.loginAttemptService.getTtl(ip));
      Logger.error(`${HttpStatus.TOO_MANY_REQUESTS} - IP ${ip} has been blocked - LoginAttemptGuard`, );
      throw new HttpException(
        { 
          message: 'Too many login attempts. Please try again later.' ,
          remainingAttempts: 0,
          retryAfterMinutes: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}