import {pgPool} from "./configPostgresSQL";
import * as fs from "fs";
import * as path from "path";

export async function runMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations');

    try {
        await pgPool.query(`CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            run_at TIMESTAMP NOT NULL DEFAULT NOW()
        )`);

        const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();
        for (const file of files) {
            const checkMigration = await pgPool.query('SELECT * FROM migrations WHERE filename = $1', [file]);
            if (checkMigration.rows.length === 0) {
                const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await pgPool.query(migrationSQL);
                await pgPool.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
                console.log(`Migration ${file} applied successfully.`);
            } else {
                console.log(`Migration ${file} already applied, skipping.`);
            }
        }
        console.log('All migrations completed.');
    } catch(error) {
        if(error instanceof Error) {
            console.error('Error running migrations:', error.message);
            return error;
        }
              return new Error(String(error));

    }
    }