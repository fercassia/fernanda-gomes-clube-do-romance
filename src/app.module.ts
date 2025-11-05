import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db/typeorm.config';
import { SeederModule } from './config/seed/seeder.module';
import { UsersModule } from './modules/users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return await typeOrmConfig(configService);
      },
    }),
    SeederModule,
    UsersModule,
    UtilsModule
  ],
})
export class AppModule {}
