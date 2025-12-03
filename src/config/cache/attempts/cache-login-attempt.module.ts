import { Module } from '@nestjs/common';
import { LoginAttemptGuard } from './login-attempt.guard';
import { LoginFailureInterceptor } from './login-failure.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { LoginAttemptService } from './loginAttempt.service';
import { CACHE_KEYS_REGISTER_CONFIG } from '../../../shared/constants/cacheKeys';

@Module({
  imports: [ CacheModule.register({
    ttl: CACHE_KEYS_REGISTER_CONFIG.TWO_HOURS_IN_MS, // 2 hours
  })], 
  providers: [LoginAttemptService, LoginAttemptGuard, LoginFailureInterceptor],
  exports: [LoginAttemptService, LoginAttemptGuard, LoginFailureInterceptor],
})
export class CacheLoginAttemptModule {}
