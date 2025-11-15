import { Module } from '@nestjs/common';
import { LoginAttemptGuard } from './login-attempt.guard';
import { LoginFailureInterceptor } from './login-failure.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { LoginAttemptService } from './loginAttempt.service';

@Module({
  imports: [ CacheModule.register({
    ttl: 2 * 1000 * 60 * 60, // default cache time-to-live: 2 hours
  })], 
  providers: [LoginAttemptService, LoginAttemptGuard, LoginFailureInterceptor],
  exports: [LoginAttemptService, LoginAttemptGuard, LoginFailureInterceptor],
})
export class CacheLoginAttemptModule {}
