import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db/typeorm.config';
import { SeederModule } from './config/seed/seeder.module';
import { UsersModule } from './modules/users/users.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthJwtModule } from './config/auth/auth-jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './config/auth/jwt-auth.guard';

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
    AuthModule,
    UtilsModule,
    AuthJwtModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
