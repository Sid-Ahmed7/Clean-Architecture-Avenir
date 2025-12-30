import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.use([
  () => import('../app/middleware/container_bindings_middleware.js'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/static/static_middleware'),
])


export const middleware = router.named({
  auth: () => import('../app/middleware/auth_middleware.js'),
  refreshAuth: () => import('../app/middleware/refresh_token_middleware.js'),
  role: () => import('../app/middleware/role_middleware'),
})
