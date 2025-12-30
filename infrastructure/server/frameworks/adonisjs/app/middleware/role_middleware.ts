import { RoleEnum } from '#domain/enums/RoleEnum.js'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
      constructor(private readonly allowedRoles: RoleEnum[]){}

  async handle(ctx: HttpContext, next: NextFn) {

    if (!ctx.auth) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }

    const hasAllowedRole = ctx.auth.roles.some((role) => this.allowedRoles.includes(role))

    if (!hasAllowedRole) {
      return ctx.response.forbidden({ message: 'Access forbidden: insufficient permissions' })
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

export function authorizeRoles(allowedRoles: RoleEnum[]) {
  return async (ctx: HttpContext, next: NextFn) => {
    const middleware = new RoleMiddleware(allowedRoles)
    return middleware.handle(ctx, next)
  }
}
