#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { runMigrations } from '../../adapters/config/database/runMigrations';
import { pgPool } from '../../adapters/config/database/configPostgresSQL';

const ENV_FILE_PATH = path.join(__dirname, '..', '.env');

type RepositoryType = 'inmemory' | 'postgres';

function readEnvFile(): string {
  try {
    return fs.readFileSync(ENV_FILE_PATH, 'utf-8');
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier .env:', error);
    process.exit(1);
  }
}

function writeEnvFile(content: string): void {
  try {
    fs.writeFileSync(ENV_FILE_PATH, content, 'utf-8');
  } catch (error) {
    console.error("Erreur lors de l'écriture du fichier .env:", error);
    process.exit(1);
  }
}

function updateRepositoryType(envContent: string, newType: RepositoryType): string {
  const regex = /^REPOSITORY_TYPE=.*$/m;
  const replacement = `REPOSITORY_TYPE=${newType}`;

  if (regex.test(envContent)) {
    return envContent.replace(regex, replacement);
  } else {
    const lines = envContent.split('\n');
    const insertIndex = lines.findIndex(line => line.includes('# Repository configuration'));

    if (insertIndex !== -1) {
      lines.splice(insertIndex + 1, 0, replacement);
      return lines.join('\n');
    }

    return envContent + '\n' + replacement;
  }
}

function getCurrentRepositoryType(envContent: string): string {
  const match = envContent.match(/^REPOSITORY_TYPE=(.*)$/m);
  return match ? match[1]! : 'non défini';
}

async function switchRepository(type: RepositoryType): Promise<void> {
  const envContent = readEnvFile();
  const currentType = getCurrentRepositoryType(envContent);

  if (currentType === type) {
    console.log(`Le type de repository est déjà configuré sur '${type}'.`);
    return;
  }

  const updatedContent = updateRepositoryType(envContent, type);
  writeEnvFile(updatedContent);

  console.log(`Repository type changé de '${currentType}' à '${type}' avec succès.`);

  if (type === 'postgres') {
    console.log('\n🔄 Exécution des migrations PostgreSQL...\n');
    try {
      await runMigrations();
      console.log('\n✅ Migrations PostgreSQL terminées avec succès.');
    } catch (error) {
      console.error('\n❌ Erreur lors de l\'exécution des migrations:', error);
      process.exit(1);
    } finally {
      await pgPool.end();
    }
  }
}

function showStatus(): void {
  const envContent = readEnvFile();
  const currentType = getCurrentRepositoryType(envContent);
  console.log(`📊 Type de repository actuel: ${currentType}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: ts-node switch-repository.ts <inmemory|postgres|--status>');
    process.exit(1);
  }

  const type = args[0]!.toLowerCase();

  if (type === '--status' || type === 'status') {
    showStatus();
    return;
  }

  if (type !== 'inmemory' && type !== 'postgres') {
    console.error('Type de repository invalide. Utilisez "inmemory", "postgres" ou "--status".');
    process.exit(1);
  }

  await switchRepository(type as RepositoryType);
}

main().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
