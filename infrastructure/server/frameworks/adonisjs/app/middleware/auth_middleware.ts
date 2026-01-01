import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AuthContext, JwtPayload } from '../../types/JwtPayload.js'
import env from '#start/env.js'
import jwt, { JwtPayload as DefaultPayload } from 'jsonwebtoken'


const JWT_SECRET = env.get('JWT_SECRET')

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    console.log('All cookies:', ctx.request.header('cookie'))
    console.log('Cookie:', ctx.request.cookie('accessToken'))

    const token = ctx.request.plainCookie('accessToken')
    console.log('Unsigned cookie:', token)


    console.log('Cookie header:', ctx.request.header('cookie'))
    console.log('Auth Middleware - accessToken:', token)

    if(!token) {
      return ctx.response.unauthorized({ message: 'Access token is missing' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
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
          message: `Token expired after ${env.get('JWT_EXPIRATION')}`
        })
      }
      console.log('JWT verification error:', error)
      return ctx.response.unauthorized({ message: 'Invalid token' })
    }

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
