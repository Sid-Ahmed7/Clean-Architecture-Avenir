import { defineConfig } from '@adonisjs/core/app';


export default defineConfig({
commands: [
    () => import('@adonisjs/core/commands'),
],

providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/core/providers/http_provider'),
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/static/static_provider'),  
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