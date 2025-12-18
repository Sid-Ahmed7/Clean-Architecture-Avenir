#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

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

function switchRepository(type: RepositoryType): void {
  const envContent = readEnvFile();
  const currentType = getCurrentRepositoryType(envContent);

  if (currentType === type) {
    console.log(`Le type de repository est déjà configuré sur '${type}'.`);
    return;
  }

  const updatedContent = updateRepositoryType(envContent, type);
  writeEnvFile(updatedContent);

  console.log(`Repository type changé de '${currentType}' à '${type}' avec succès.`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: ts-node switch-repository.ts <inmemory|postgres>');
    process.exit(1);
  }

  const type = args[0]!.toLowerCase();

  if (type !== 'inmemory' && type !== 'postgres') {
    console.error('Type de repository invalide. Utilisez "inmemory" ou "postgres".');
    process.exit(1);
  }

  switchRepository(type as RepositoryType);
}

main();
