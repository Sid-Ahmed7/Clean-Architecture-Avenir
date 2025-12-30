import { defineConfig, targets } from '@adonisjs/core/logger'
import env from '#start/env.js'

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: targets.pretty({
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      }),
    },
  },
})

export default loggerConfig;
