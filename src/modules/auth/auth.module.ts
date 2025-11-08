import { Module } from '@nestjs/common';
import { UtilsModule } from '../../utils/utils.module';
import { LoginUsersMapper } from '../auth/mapper/loginUsers.mapper';
import { LoginUsersModel } from '../auth/model/loginUsers.model';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, UtilsModule],
  controllers: [AuthController],
  providers: [LoginUsersMapper,LoginUsersModel, AuthService],
  exports: [LoginUsersMapper, LoginUsersModel, AuthService],
})
export class AuthModule {}
