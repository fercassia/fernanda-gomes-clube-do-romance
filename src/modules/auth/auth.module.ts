import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from '../../utils/utils.module';
import { LoginUsersMapper } from '../auth/mapper/loginUsers.mapper';
import { LoginUsersModel } from '../auth/model/loginUsers.model';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: `${Number(process.env.JWT_TIME)}s`},
  }), 
  UsersModule, UtilsModule],
  controllers: [AuthController],
  providers: [ AuthService, JwtStrategy, LoginUsersMapper, LoginUsersModel ],
  exports: [  AuthService, JwtModule, LoginUsersMapper, LoginUsersModel ],
})
export class AuthModule {}
