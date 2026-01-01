import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

export default defineConfig({
  enabled: true,

  origin: [env.get('CLIENT_BASE_URL')],

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],

  headers: true,

  exposeHeaders: [],

  credentials: true,

  maxAge: 90,
})
