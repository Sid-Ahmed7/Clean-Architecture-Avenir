import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AuthContext, JwtPayload } from '../../types/JwtPayload.js'
import jwt, { JwtPayload as DefaultPayload } from 'jsonwebtoken'
import env from '../../start/env.js'


const JWT_SECRET_REFRESH = env.get('JWT_SECRET_REFRESH')

export default class RefreshTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
     const refreshToken = ctx.request.cookie('refreshToken')
        if(!refreshToken) {
          return ctx.response.unauthorized({ message: 'Refresh Token is required' })
        }
        try {
          const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH)
          const payload: JwtPayload = decoded as JwtPayload

          if (!isJwtPayload(payload)) {
            return ctx.response.unauthorized({ message: 'Invalid token format' })
          }


          ctx.auth = {
            userId: payload.sub,
            roles: payload.roles,
          }

        } catch(error) {
          if (error instanceof jwt.TokenExpiredError) {
            return ctx.response.unauthorized({
              message: `Token expired after ${env.get('JWT_EXPIRATION_REFRESH')}`
            })
          }
          return ctx.response.unauthorized({ message: 'Invalid token' })
        }
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
function isJwtPayload(obj: DefaultPayload): obj is JwtPayload {
    return obj && typeof obj === 'object' && typeof obj.sub === 'string' && Array.isArray(obj.roles)
  }
