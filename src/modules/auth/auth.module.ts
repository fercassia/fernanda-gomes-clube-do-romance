import { Module } from '@nestjs/common';
import { UtilsModule } from '../../utils/utils.module';
import { LoginUsersMapper } from '../auth/mapper/loginUsers.mapper';
import { LoginUsersModel } from '../auth/model/loginUsers.model';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { AuthJwtModule } from '../../config/auth/auth-jwt.module';
import { CacheLoginAttemptModule } from '../../config/cache/cache-login-attempt.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ AuthJwtModule, UsersModule, UtilsModule, CacheLoginAttemptModule, CacheModule.register()],
  controllers: [AuthController],
  providers: [ AuthService, LoginUsersMapper, LoginUsersModel],
  exports: [  AuthService, LoginUsersMapper, LoginUsersModel],
})
export class AuthModule {}
