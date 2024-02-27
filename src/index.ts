import dotenv from 'dotenv';
dotenv.config();

import {type MigrateDBConfig, migrate} from 'postgres-migrations';
import fs from 'fs';
import {log} from './log';

const requiredEnvironmentVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_PORT', 'DB_DATABASE', 'MIGRATIONS_PATH'];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(envVar => !process.env[envVar]);
if (missingEnvironmentVariables.length > 0) {
  log('ERROR', 'setup', `Missing environment variables: ${missingEnvironmentVariables.join(', ')}`);
  process.exit(1);
}

const migrationsPath = process.env.MIGRATIONS_PATH as string;
if (!fs.existsSync(migrationsPath)) {
  log('ERROR', 'setup', `Migrations path does not exist: ${migrationsPath}`);
  process.exit(1);
}

const connectionParams: MigrateDBConfig = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  port: Number(process.env.DB_PORT as string),
  database: process.env.DB_DATABASE as string,
  defaultDatabase: 'postgres',
  ensureDatabaseExists: true,
};
(async () => {
  try {
    log('INFO', 'database-migration', 'Database migration started...');
    const result = await migrate(connectionParams, migrationsPath);
    if (result.length === 0) {
      log('LOG', 'database-migration', 'Database migration completed! No migrations were applied.');
      return;
    }

    console.table(result.map(r => ({id: r.id, hash: r.hash, name: r.name, fileName: r.fileName})));
    log('LOG', 'database-migration', 'Database migration completed! Applied ' + result.length + ' migrations.');
  } catch (error) {
    console.error(error);
    log('ERROR', 'database-migration', error!);
  }
})();
