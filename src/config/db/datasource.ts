import 'dotenv/config';
import { DirEntitiesAndMigrations } from '../../utils/dirEntitiesAndMigrations';
import { DataSource } from 'typeorm';

const entitiesPattern = DirEntitiesAndMigrations.whichDirEntities();
const migrationsPattern = DirEntitiesAndMigrations.whichDirMigrations();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'clubedoromance',
  entities: [entitiesPattern],
  migrations: [migrationsPattern],
  synchronize: false,
  logging: true,
});

export default dataSource;