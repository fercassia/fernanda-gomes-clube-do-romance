import { Logger } from "@nestjs/common";
import dataSource from "./datasource";
import { Metadata } from "../../utils/metaData";

dataSource.initialize()
.then( async () => {
  Logger.log('Data Source has been initialized!', { timestamp: new Date().toISOString() });
  const pendingMigrations = await dataSource.showMigrations();

  if (pendingMigrations) {
    Logger.log('Running pending migrations...', Metadata.create());
    await dataSource.runMigrations();
    Logger.log('Migrations have been run successfully!', Metadata.create());
  } else {
    Logger.log('No migrations pending!', Metadata.create());
  }
  await dataSource.destroy();
  Logger.log('Data Source has been destroyed!', Metadata.create());
}).catch((error) => {
  Logger.fatal('Error during Data Source initialization', Metadata.create({error: error, trace: error.stack}));
  process.exit(1);
});