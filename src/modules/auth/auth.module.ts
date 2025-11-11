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
import { ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE } from './interfaces/repository/iAttemptsBlockedRepository.interface';
import { AttemptsBlockedEntity } from './entities/attemptsBlocked.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsBlockedRepository } from './repositories/attemptsBlocked.repository';
import { AttemptsBlockedMapper } from './mapper/attemptsBlocked.mapper';
import { AttemptsBlockedModel } from './model/attemptsBlocked.model';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptsBlockedEntity]), PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: `${Number(process.env.JWT_TIME)}s`},
  }), 
  UsersModule, UtilsModule],
  controllers: [AuthController],
  providers: [ AuthService, JwtStrategy, LoginUsersMapper, LoginUsersModel, AttemptsBlockedMapper, AttemptsBlockedModel, {
    provide: ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE,
    useClass: AttemptsBlockedRepository
  }],
  exports: [  AuthService, JwtModule, LoginUsersMapper, LoginUsersModel,AttemptsBlockedMapper, AttemptsBlockedModel,{
    provide: ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE,
    useClass: AttemptsBlockedRepository
  }],
})
export class AuthModule {}
