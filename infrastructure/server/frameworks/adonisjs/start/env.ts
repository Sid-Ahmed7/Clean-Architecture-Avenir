import { Env } from '@adonisjs/core/env'

const env =  await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  APP_NAME: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  REPOSITORY_TYPE: Env.schema.enum(['inmemory', 'postgress'] as const),

  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),


  JWT_SECRET: Env.schema.string(),
  JWT_SECRET_REFRESH: Env.schema.string(),

  CLIENT_BASE_URL: Env.schema.string({ format: 'url' }),

  RESEND_API_KEY: Env.schema.string(),
  EMAIL_FROM: Env.schema.string(),
})

export default env