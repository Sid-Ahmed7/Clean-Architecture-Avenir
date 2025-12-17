import {Pool, PoolConfig} from 'pg';

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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