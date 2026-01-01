import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.use([
  () => import('#middleware/container_bindings_middleware.js'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('#middleware/bodyparser_middleware.js'),
  () => import('@adonisjs/static/static_middleware'),
])


export const middleware = router.named({
  refreshToken: () => import('#middleware/refresh_token_middleware.js'),
  auth: () => import('#middleware/auth_middleware.js'),
  refreshAuth: () => import('#middleware/refresh_token_middleware.js'),
})
