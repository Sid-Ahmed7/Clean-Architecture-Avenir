#!/usr/bin/env tsx

/**
 * Script pour basculer entre Express et AdonisJS
 * Usage: tsx switch-framework.ts <express|adonisjs>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface FrameworkConfig {
  name: string;
  dir: string;
  entryPoint: string;
  packageJson: string;
  env: string;
  scripts: {
    dev: string;
  };
}

interface FrameworksConfig {
  [key: string]: FrameworkConfig;
}

interface ConfigFile {
  current: string;
  lastUpdated: string;
}

const FRAMEWORKS: FrameworksConfig = {
  express: {
    name: 'Express',
    dir: 'frameworks/express',
    entryPoint: 'frameworks/express/server.ts',
    packageJson: 'frameworks/express/package.json',
    env: 'frameworks/express/.env',
    scripts: {
      dev: 'cd frameworks/express && npm run dev',
    }
  },
  adonisjs: {
    name: 'AdonisJS',
    dir: 'frameworks/adonisjs',
    entryPoint: 'frameworks/adonisjs/bin/server.ts',
    packageJson: 'frameworks/adonisjs/package.json',
    env: 'frameworks/adonisjs/.env',
    scripts: {
      dev: 'cd frameworks/adonisjs && npm run dev'
    }
  }
};

const CONFIG_FILE = '.framework-config.json';

function getCurrentFramework(): string | null {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config: ConfigFile = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.current;
    }
  } catch (error) {
  }
  return null;
}

function saveCurrentFramework(framework: string): void {
  const config: ConfigFile = {
    current: framework,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function createSymlinks(framework: string): void {
  const config = FRAMEWORKS[framework];

  console.log(`\n📦 Configuration des liens symboliques pour ${config.name}...`);

  const envLink = '.env';
  if (fs.existsSync(envLink)) {
    fs.unlinkSync(envLink);
  }

  try {
    if (process.platform === 'win32') {
      fs.copyFileSync(config.env, envLink);
      console.log(`✅ .env copié depuis ${config.env}`);
    } else {
      fs.symlinkSync(config.env, envLink);
      console.log(`✅ .env lié à ${config.env}`);
    }
  } catch (error) {
    const err = error as Error;
    console.warn(`⚠️  Impossible de créer le lien pour .env: ${err.message}`);
  }
}

function updatePackageJsonScripts(framework: string): void {
  const config = FRAMEWORKS[framework];
  const packageJsonPath = 'package.json';

  console.log(`\n📝 Mise à jour du package.json...`);

  try {
    let packageJson: any = {};

    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }

    // Mise à jour des scripts
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.dev = config.scripts.dev;
    packageJson.scripts['switch:express'] = 'tsx switch-framework.ts express';
    packageJson.scripts['switch:adonisjs'] = 'tsx switch-framework.ts adonisjs';

    // Ajouter les dépendances nécessaires si elles n'existent pas
    packageJson.devDependencies = packageJson.devDependencies || {};
    if (!packageJson.devDependencies['tsx']) {
      packageJson.devDependencies['tsx'] = '^4.19.2';
    }
    if (!packageJson.devDependencies['@types/node']) {
      packageJson.devDependencies['@types/node'] = '^24.4.0';
    }
    if (!packageJson.devDependencies['typescript']) {
      packageJson.devDependencies['typescript'] = '^5.9.2';
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ Scripts mis à jour pour ${config.name}`);
  } catch (error) {
    const err = error as Error;
    console.error(` Erreur lors de la mise à jour du package.json: ${err.message}`);
  }
}

function installDependencies(framework: string): void {
  const config = FRAMEWORKS[framework];

  console.log(`\n📥 Vérification des dépendances pour ${config.name}...`);

  try {
    const frameworkDir = path.resolve(config.dir);

    if (!fs.existsSync(path.join(frameworkDir, 'node_modules'))) {
      console.log(`Installation des dépendances dans ${config.dir}...`);
      execSync('npm install', {
        cwd: frameworkDir,
        stdio: 'inherit'
      });
      console.log(`✅ Dépendances installées`);
    } else {
      console.log(`✅ Dépendances déjà installées`);
    }
  } catch (error) {
    const err = error as Error;
    console.error(` Erreur lors de l'installation des dépendances: ${err.message}`);
  }
}

function displayInfo(framework: string): void {
  const config = FRAMEWORKS[framework];

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Framework actif: ${config.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📁 Répertoire: ${config.dir}`);
  console.log(`📄 Point d'entrée: ${config.entryPoint}`);
  console.log(`\n📜 Commandes disponibles:`);
  console.log(`  • npm run dev   → Démarrer le serveur en mode développement`);
  console.log(`  • npm run build → Compiler le projet`);
  console.log(`  • npm start     → Démarrer le serveur en production`);
  console.log(`\n💡 Pour basculer vers l'autre framework:`);
  console.log(`  npm run switch:${framework === 'express' ? 'adonisjs' : 'express'}`);
  console.log(`  ou: tsx switch-framework.ts ${framework === 'express' ? 'adonisjs' : 'express'}`);
  console.log(`${'='.repeat(60)}\n`);
}

function switchFramework(targetFramework: string): void {
  if (!FRAMEWORKS[targetFramework]) {
    console.error(` Framework invalide: ${targetFramework}`);
    console.log(`\n✅ Frameworks disponibles: ${Object.keys(FRAMEWORKS).join(', ')}`);
    process.exit(1);
  }

  const currentFramework = getCurrentFramework();

  if (currentFramework === targetFramework) {
    console.log(`ℹ️  Le framework ${FRAMEWORKS[targetFramework].name} est déjà actif.`);
    displayInfo(targetFramework);
    return;
  }

  console.log(`\n🔄 Basculement vers ${FRAMEWORKS[targetFramework].name}...`);

  // Vérifier que le répertoire du framework existe
  if (!fs.existsSync(FRAMEWORKS[targetFramework].dir)) {
    console.error(` Le répertoire ${FRAMEWORKS[targetFramework].dir} n'existe pas.`);
    process.exit(1);
  }

  // Mettre à jour la configuration
  createSymlinks(targetFramework);
  updatePackageJsonScripts(targetFramework);
  installDependencies(targetFramework);
  saveCurrentFramework(targetFramework);

  console.log(`\n✅ Basculement vers ${FRAMEWORKS[targetFramework].name} terminé avec succès!`);
  displayInfo(targetFramework);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const current = getCurrentFramework();

    console.log('\n📋 Usage: tsx switch-framework.ts <express|adonisjs>\n');
    console.log('Frameworks disponibles:');
    console.log('  • express   → Express.js + Socket.IO');
    console.log('  • adonisjs  → AdonisJS 6 + Lucid ORM\n');

    if (current) {
      console.log(`Framework actuel: ${FRAMEWORKS[current].name} ✅\n`);
    } else {
      console.log('Aucun framework configuré.\n');
    }

    console.log('💡 Raccourcis NPM:');
    console.log('  • npm run switch:express');
    console.log('  • npm run switch:adonisjs\n');

    process.exit(0);
  }

  const targetFramework = args[0].toLowerCase();
  switchFramework(targetFramework);
}

main();
