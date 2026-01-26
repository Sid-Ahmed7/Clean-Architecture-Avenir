import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create database pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
});

async function resetDatabase() {
    console.log('🔄 Starting database reset...\n');

    try {
        // Get all table names
        const tablesResult = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
        `);

        const tables = tablesResult.rows.map(row => row.tablename);

        if (tables.length === 0) {
            console.log('ℹ️  No tables found in database.\n');
        } else {
            console.log(`📋 Found ${tables.length} tables to drop:`);
            tables.forEach(table => console.log(`   - ${table}`));
            console.log('');

            // Drop all tables
            console.log('🗑️  Dropping all tables...');
            await pool.query('DROP SCHEMA public CASCADE');
            await pool.query('CREATE SCHEMA public');
            await pool.query('GRANT ALL ON SCHEMA public TO postgres');
            await pool.query('GRANT ALL ON SCHEMA public TO public');
            console.log('✅ All tables dropped\n');
        }

        // Drop all custom types
        console.log('🗑️  Dropping all custom types...');
        const typesResult = await pool.query(`
            SELECT typname 
            FROM pg_type 
            WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            AND typtype = 'e'
        `);

        for (const row of typesResult.rows) {
            await pool.query(`DROP TYPE IF EXISTS ${row.typname} CASCADE`);
        }
        console.log('✅ All custom types dropped\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Database reset completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('💡 Next steps:');
        console.log('   1. Run migrations: npm run migrate');
        console.log('   2. Load fixtures: npm run fixtures:messaging\n');

    } catch (error) {
        console.error('❌ Error resetting database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the reset
resetDatabase()
    .then(() => {
        console.log('✅ Process completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Process failed:', error);
        process.exit(1);
    });
