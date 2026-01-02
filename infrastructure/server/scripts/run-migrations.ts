import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { runMigrations } from '../../adapters/config/database/runMigrations';

async function main() {
    const error = await runMigrations();

    if (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }

    console.log('Migrations completed successfully');
    process.exit(0);
}

main();
