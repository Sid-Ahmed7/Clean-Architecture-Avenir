import type { Socket } from 'socket.io'
import jwt, { JwtPayload as DefaultPayload } from 'jsonwebtoken'
import cookie from 'cookie'
import type { AuthContext, JwtPayload } from '#types/JwtPayload.js'
import env from '#start/env.js'

const JWT_SECRET = env.get('JWT_SECRET')

export default class SocketMiddleware {
  handle(socket: Socket, next: (err?: Error) => void) {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '')
      const token = cookies.accessToken || socket.handshake.auth?.token

      if (!token) {
        return next(new Error('Unauthorized: No token provided'))
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      const payload: JwtPayload = decoded as JwtPayload

      if (!isJwtPayload(payload)) {
        return next(new Error('Unauthorized: Invalid token format'))
      }

      socket.data.user = {
        userId: payload.sub,
        roles: payload.roles,
      }

      next()
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new Error(`Unauthorized: Token expired after ${env.get('JWT_EXPIRATION')}`))
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new Error('Unauthorized: Invalid token'))
      }
      return next(new Error('Unauthorized: Authentication failed'))
    }
  }
}

declare module 'socket.io' {
  interface SocketData {
    user?: AuthContext
  }
}

function isJwtPayload(obj: DefaultPayload): obj is JwtPayload {
  return obj && typeof obj === 'object' && typeof obj.sub === 'string' && Array.isArray(obj.roles)
}
