import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from '../../modules/users/entities/roles.entity';
import { SeederService } from './seeder.service';
import { UsersRolesSeed } from './seeds/usersRoles.seed';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity]),
  // Demais entidades aqui
  ],
  providers: [SeederService, UsersRolesSeed],
})
export class SeederModule {}
