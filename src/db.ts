import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';
import path from 'node:path';

dotenv.config();

if (!process.env.DB_HOST) {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../config/.env'),
  });
}

let pool: Pool | undefined;

export function getDbPool(): Pool {
  if (pool) {
    return pool;
  }

  const requiredEnvironmentVariables = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ] as const;

  for (const variable of requiredEnvironmentVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }

  const configuredPort = Number.parseInt(process.env.DB_PORT ?? '3306', 10);
  const port = Number.isNaN(configuredPort) ? 3306 : configuredPort;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}
