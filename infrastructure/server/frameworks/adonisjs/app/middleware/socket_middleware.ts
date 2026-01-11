import type { Socket } from 'socket.io'
import jwt, { JwtPayload as DefaultPayload } from 'jsonwebtoken'
import type { AuthContext, JwtPayload } from '#types/JwtPayload.js'
import env from '#start/env.js'

const JWT_SECRET = env.get('JWT_SECRET')

export default class SocketMiddleware {
  handle(socket: Socket, next: (err?: Error) => void) {


    try {
      let token: string | undefined

      token = socket.handshake.auth?.token

      if (!token && socket.handshake.headers.cookie) {
        const cookies = parseCookies(socket.handshake.headers.cookie)
        token = cookies.accessToken

        if (token) {
          try {
            const decodedBase64 = Buffer.from(token, 'base64').toString('utf-8')

            const parsed = JSON.parse(decodedBase64)
            if (parsed && parsed.message) {
              token = parsed.message
            }
          } catch (err) {
              return next(new Error('Decoding error', { cause: err }))
          }
        }
      }

      if (!token && socket.handshake.query?.token) {
        token = socket.handshake.query.token as string
      }



      if (!token) {
        return next(new Error('Unauthorized: No token provided'))
      }

      const cleanToken = token.trim()

      const decoded = jwt.verify(cleanToken, JWT_SECRET)
      const payload = decoded as JwtPayload

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

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.split('=')
    const value = rest.join('=').trim()
    if (name && value) {
      cookies[name.trim()] = decodeURIComponent(value)
    }
    return cookies
  }, {} as Record<string, string>)
}

declare module 'socket.io' {
  interface SocketData {
    user?: AuthContext
  }
}

function isJwtPayload(obj: DefaultPayload): obj is JwtPayload {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.sub === 'string' &&
    Array.isArray(obj.roles)
  )
}
