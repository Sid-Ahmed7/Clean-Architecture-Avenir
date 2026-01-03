#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { runMigrations } from '../../adapters/config/database/runMigrations';
import { pgPool } from '../../adapters/config/database/configPostgresSQL';

const SERVER_ENV_FILE_PATH = path.join(__dirname, '..', '.env');
const EXPRESS_ENV_FILE_PATH = path.join(__dirname, '..', 'frameworks', 'express', '.env');
const ADONISJS_ENV_FILE_PATH = path.join(__dirname, '..', 'frameworks', 'adonisjs', '.env');

type RepositoryType = 'inmemory' | 'postgres';

function readEnvFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    process.exit(1);
  }
}

function writeEnvFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${filePath}:`, error);
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

function updateEnvFile(filePath: string, type: RepositoryType, label: string): void {
  try {
    const envContent = readEnvFile(filePath);
    const updatedContent = updateRepositoryType(envContent, type);
    writeEnvFile(filePath, updatedContent);
    console.log(`  ✅ ${label} mis à jour`);
  } catch (error) {
    console.error(`  ❌ Erreur lors de la mise à jour de ${label}:`, error);
  }
}

async function switchRepository(type: RepositoryType): Promise<void> {
  const serverEnvContent = readEnvFile(SERVER_ENV_FILE_PATH);
  const currentType = getCurrentRepositoryType(serverEnvContent);

  if (currentType === type) {
    console.log(`Le type de repository est déjà configuré sur '${type}'.`);
    return;
  }

  console.log(`\n🔄 Changement du repository de '${currentType}' à '${type}'...\n`);

  updateEnvFile(SERVER_ENV_FILE_PATH, type, 'Server .env');
  updateEnvFile(EXPRESS_ENV_FILE_PATH, type, 'Express .env');
  updateEnvFile(ADONISJS_ENV_FILE_PATH, type, 'AdonisJS .env');

  console.log(`\n✅ Repository type changé avec succès pour tous les frameworks.`);

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
  console.log('\n📊 Type de repository actuel:\n');

  const serverEnvContent = readEnvFile(SERVER_ENV_FILE_PATH);
  const serverType = getCurrentRepositoryType(serverEnvContent);
  console.log(`  Server:    ${serverType}`);

  try {
    const expressEnvContent = readEnvFile(EXPRESS_ENV_FILE_PATH);
    const expressType = getCurrentRepositoryType(expressEnvContent);
    console.log(`  Express:   ${expressType}`);
  } catch (error) {
    console.log(`  Express:   fichier non trouvé`);
  }

  try {
    const adonisEnvContent = readEnvFile(ADONISJS_ENV_FILE_PATH);
    const adonisType = getCurrentRepositoryType(adonisEnvContent);
    console.log(`  AdonisJS:  ${adonisType}`);
  } catch (error) {
    console.log(`  AdonisJS:  fichier non trouvé`);
  }

  console.log('');
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
