import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';

dotenv.config();

let pool: Pool | undefined;

export function getDbPool(): Pool {
  if (pool) {
    return pool;
  }

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new Error('Missing required database environment variables');
  }

  pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}
