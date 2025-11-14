import { Module } from '@nestjs/common';
import { UtilsModule } from '../../utils/utils.module';
import { LoginUsersMapper } from '../auth/mapper/loginUsers.mapper';
import { LoginUsersModel } from '../auth/model/loginUsers.model';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE } from './interfaces/repository/iAttemptsBlockedRepository.interface';
import { AttemptsBlockedEntity } from './entities/attemptsBlocked.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsBlockedRepository } from './repositories/attemptsBlocked.repository';
import { AttemptsBlockedMapper } from './mapper/attemptsBlocked.mapper';
import { AttemptsBlockedModel } from './model/attemptsBlocked.model';
import { AttemptsBlockService } from './services/attemptsBlock.service';
import { AuthJwtModule } from '../../config/auth/auth-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptsBlockedEntity]), AuthJwtModule, UsersModule, UtilsModule],
  controllers: [AuthController],
  providers: [ AuthService, LoginUsersMapper, LoginUsersModel, AttemptsBlockedMapper, AttemptsBlockedModel, AttemptsBlockService, {
    provide: ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE,
    useClass: AttemptsBlockedRepository
  }],
  exports: [  AuthService, LoginUsersMapper, LoginUsersModel, AttemptsBlockedMapper, AttemptsBlockedModel, AttemptsBlockService, {
    provide: ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE,
    useClass: AttemptsBlockedRepository
  }],
})
export class AuthModule {}
