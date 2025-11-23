import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DirEntitiesAndMigrations } from "../../utils/dirEntitiesAndMigrations";
 

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    const entitiesPattern = DirEntitiesAndMigrations.whichDirEntities();
    const migrationsPattern = DirEntitiesAndMigrations.whichDirMigrations();
    
    return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME', 'clubedoromance'),
        entities: [entitiesPattern],
        migrations: [migrationsPattern],
        migrationsRun: false,
        autoLoadEntities: true,
        synchronize: false, // false em producao
        retryAttempts: 10, // tentativas de reconexão
        retryDelay: 5000,  // tempo entre tentativas
        logging: true,
    };
};