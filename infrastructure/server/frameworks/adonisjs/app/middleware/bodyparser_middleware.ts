import { BodyParserMiddleware } from '@adonisjs/bodyparser/bodyparser_middleware'
import bodyParserConfig from '#config/bodyparser.js'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BodyParserMiddlewareWrapper {
  private readonly middleware: BodyParserMiddleware

  constructor() {
    this.middleware = new BodyParserMiddleware(bodyParserConfig)
  }

  async handle(ctx: HttpContext, next: NextFn) {
    return this.middleware.handle(ctx, next)
  }
}
