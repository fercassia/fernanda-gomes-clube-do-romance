import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeUsersEntity } from 'src/app/users/entities/typeUsers.entity';
import { SeederService } from './seeder.service';
import { UsersTypeSeed } from './seeds/usersType.seed';

@Module({
  imports: [TypeOrmModule.forFeature([TypeUsersEntity]),
  // Demais entidades aqui
  ],
  providers: [SeederService, UsersTypeSeed],
})
export class SeederModule {}
