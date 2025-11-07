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

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, RolesEntity]), UtilsModule],
  controllers: [UsersController],
  providers: [UsersService, CreateUsersMapper, UsersModel, {
    provide: USERS_REPOSITORY_INTERFACE,
    useClass: UsersRepository
    },
  ],
  exports: [UsersService, CreateUsersMapper, UsersModel],
})
export class UsersModule {}
