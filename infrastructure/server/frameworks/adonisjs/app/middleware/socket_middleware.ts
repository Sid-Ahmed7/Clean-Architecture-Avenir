import type { Socket } from 'socket.io'
import jwt, { JwtPayload as DefaultPayload } from 'jsonwebtoken'
import type { AuthContext, JwtPayload } from '#types/JwtPayload.js'
import env from '#start/env.js'

const JWT_SECRET = env.get('JWT_SECRET')

export default class SocketMiddleware {
  handle(socket: Socket, next: (err?: Error) => void) {
    console.log('🔌 [SOCKET] Connection attempt')
    console.log('🔌 [SOCKET] Headers:', socket.handshake.headers)
    console.log('🔌 [SOCKET] Auth:', socket.handshake.auth)
    console.log('🔌 [SOCKET] Cookie header:', socket.handshake.headers.cookie)

    try {
      let token: string | undefined

      token = socket.handshake.auth?.token

      if (!token && socket.handshake.headers.cookie) {
        const cookies = parseCookies(socket.handshake.headers.cookie)
        console.log('🔌 [SOCKET] Parsed cookies:', cookies)
        token = cookies.accessToken

        if (token) {
          try {
            const decodedBase64 = Buffer.from(token, 'base64').toString('utf-8')
            console.log('🔌 [SOCKET] Decoded base64 (first 50 chars):', decodedBase64.substring(0, 50))

            const parsed = JSON.parse(decodedBase64)
            if (parsed && parsed.message) {
              console.log('🔌 [SOCKET] Token unwrapped from message')
              token = parsed.message
            }
          } catch (err) {
            console.log('🔌 [SOCKET] Decoding error:', err)
          }
        }
      }

      if (!token && socket.handshake.query?.token) {
        token = socket.handshake.query.token as string
      }

      console.log('🔌 [SOCKET] Token found:', !!token)
      console.log('🔌 [SOCKET] Raw token (first 50 chars):', token?.substring(0, 50))
      console.log('🔌 [SOCKET] Token length:', token?.length)

      if (!token) {
        console.log(' [SOCKET] No token')
        return next(new Error('Unauthorized: No token provided'))
      }

      const cleanToken = token.trim()
      console.log('🔌 [SOCKET] Cleaned token (first 50 chars):', cleanToken.substring(0, 50))

      const decoded = jwt.verify(cleanToken, JWT_SECRET)
      const payload = decoded as JwtPayload

      if (!isJwtPayload(payload)) {
        console.log(' [SOCKET] Invalid payload format')
        return next(new Error('Unauthorized: Invalid token format'))
      }

      socket.data.user = {
        userId: payload.sub,
        roles: payload.roles,
      }

      console.log('[SOCKET] Auth successful for:', payload.sub)
      next()
    } catch (err) {
      console.log(' [SOCKET] Error:', err)
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
