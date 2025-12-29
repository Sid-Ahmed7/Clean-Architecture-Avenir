import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/static/static_middleware'),
])


export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  refreshAuth: () => import('#middleware/refresh_token_middleware'),
  role: () => import('#middleware/role_middleware'),
})