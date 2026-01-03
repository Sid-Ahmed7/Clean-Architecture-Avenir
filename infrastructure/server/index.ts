#!/usr/bin/env tsx

/**
 * Point d'entrée unifié pour le serveur backend
 * Charge automatiquement le framework configuré (Express ou AdonisJS)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ConfigFile {
  current: string;
  lastUpdated: string;
}

const CONFIG_FILE = path.join(__dirname, '.framework-config.json');

function getCurrentFramework(): string | null {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config: ConfigFile = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.current;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la lecture de la configuration:', error);
  }
  return null;
}

function startServer(): void {
  const framework = getCurrentFramework();

  if (!framework) {
    console.error('\n❌ Aucun framework configuré!');
    console.log('\n💡 Veuillez d\'abord configurer un framework:');
    console.log('  • npm run switch:express');
    console.log('  • npm run switch:adonisjs\n');
    process.exit(1);
  }

  console.log(`\n🚀 Démarrage du serveur avec ${framework.toUpperCase()}...\n`);

  try {
    if (framework === 'express') {
      // Démarrer Express
      execSync('npm run dev', {
        cwd: path.join(__dirname, 'frameworks/express'),
        stdio: 'inherit'
      });
    } else if (framework === 'adonisjs') {
      // Démarrer AdonisJS
      execSync('npm run dev', {
        cwd: path.join(__dirname, 'frameworks/adonisjs'),
        stdio: 'inherit'
      });
    } else {
      console.error(`❌ Framework inconnu: ${framework}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();
