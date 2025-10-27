import { Logger } from "@nestjs/common";
import dataSource from "./datasource";



dataSource.initialize()
.then( async () => {
  Logger.log('Data Source has been initialized!', { timestamp: new Date().toISOString() });
  const pendingMigrations = await dataSource.showMigrations();

  if (pendingMigrations) {
    Logger.log('Running pending migrations...', { timestamp: new Date().toISOString() });
    await dataSource.runMigrations();
    Logger.log('Migrations have been run successfully!', { timestamp: new Date().toISOString() });
  } else {
    Logger.log('No migrations pending!', { timestamp: new Date().toISOString() });
  }
  await dataSource.destroy();
  Logger.log('Data Source has been destroyed!', { timestamp: new Date().toISOString() });
  process.exit(0);  
}).catch((error) => {
  Logger.fatal('Error during Data Source initialization', error, { timestamp: new Date().toISOString(), trace: error.stack });
  process.exit(1);
});