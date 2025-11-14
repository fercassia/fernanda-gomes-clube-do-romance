import { Module } from '@nestjs/common';
import { LoginAttemptGuard } from './login-attempt.guard';
import { LoginFailureInterceptor } from './login-failure.interceptor';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ CacheModule.register()], 
  providers: [LoginAttemptGuard, LoginFailureInterceptor],
  exports: [LoginAttemptGuard, LoginFailureInterceptor],
})
export class CacheLoginAttemptModule {}
