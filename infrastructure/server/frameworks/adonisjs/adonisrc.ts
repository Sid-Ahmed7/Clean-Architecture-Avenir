import { defineConfig } from '@adonisjs/core/app'


export default defineConfig({

  typescript: true,

  directories: {
    config: 'config',
    public: 'public',
    contracts: 'contracts',
    providers: 'providers',
    languageFiles: 'resources/lang',
    migrations: 'database/migrations',
    seeders: 'database/seeders',
    factories: 'database/factories',
    views: 'resources/views',
    start: 'start',
    tmp: 'tmp',
    httpControllers: 'app/controllers',
    httpMiddleware: 'app/middleware',
    commands: 'commands',
    tests: 'tests',
    types: 'types',
    bin: 'bin'
  },

  commands: [
    () => import('@adonisjs/core/commands'),

  ],

  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('#providers/app'),
    () => import('@adonisjs/core/providers/vinejs_provider')
  ],

  preloads: [
    () => import('#start/routes'),
    () => import('#start/kernel'),
  ],

  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false,
    },
  ],

  assetsBundler: false,
})
