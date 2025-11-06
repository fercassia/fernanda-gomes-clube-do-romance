import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { CreateUsersMapper } from './mapper/createUsers.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { USERS_REPOSITORY_INTERFACE } from './interfaces/repository/iUsersRepository.interface';
import { RolesEntity } from './entities/roles.entity';
import { UsersModel } from './model/users.model';
import { UtilsModule } from '../../utils/utils.module';
import { VerificationCodesEntity } from './entities/verificationCodes.entity';
import { ActiveUsersMapper } from './mapper/activeUsers.mapper';
import { ActiveUsersModel } from './model/activeUsers.model';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, RolesEntity, VerificationCodesEntity]), UtilsModule],
  controllers: [UsersController],
  providers: [UsersService, CreateUsersMapper, ActiveUsersMapper, UsersModel, ActiveUsersModel, {
    provide: USERS_REPOSITORY_INTERFACE,
    useClass: UsersRepository
    },
  ],
  exports: [UsersService, CreateUsersMapper, UsersModel, ActiveUsersMapper, ActiveUsersModel],
})
export class UsersModule {}
