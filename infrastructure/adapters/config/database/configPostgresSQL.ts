import {Pool, PoolConfig} from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

if (!process.env.DB_PASSWORD) {
    dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });
}

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
export const pgPool = new Pool(poolConfig);

pgPool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pgPool.on('error', (err) => {
    console.error('Unexpected error on PostgreSQL client', err);
    process.exit(-1);
});