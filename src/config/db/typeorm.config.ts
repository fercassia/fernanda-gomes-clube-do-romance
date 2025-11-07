import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
 

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME', 'clubedoromance'),
    entities: [__dirname + '/../../modules/**/entities/*{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
    autoLoadEntities: true,
    synchronize: false, // false em producao
    retryAttempts: 10, // tentativas de reconexão
    retryDelay: 5000,  // tempo entre tentativas
    logging: true,
});