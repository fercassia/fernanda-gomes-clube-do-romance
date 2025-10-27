import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersMapper } from './mapper/users.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper,{
    provide: 'USERS_REPOSITORY_INTERFACE',
    useClass: UsersRepository},
  ],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
