import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db/typeorm.config';
import { LoggerService } from './config/log/service/LoggerService';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogginInterceptor } from './config/log/LogginInterceptor';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return await typeOrmConfig(configService);
      },
    })
    //Demais módulos aqui
  ],
  providers: [LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginInterceptor,
    },
    //Demais providers aqui
  ],
})
export class AppModule {}

//TODO: Realizar testes unitários e de integração para interceptor de logging e sanitização de dados.
