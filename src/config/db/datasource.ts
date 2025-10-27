import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'clubedoromance',
  entities: isProduction 
    ? ['dist/modules/**/entities/*.js'] 
    : ['src/modules/**/entities/*{.ts,.js}'],
  migrations: isProduction 
    ? ['dist/database/migration/*.js'] 
    : ['src/database/migration/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

export default dataSource;