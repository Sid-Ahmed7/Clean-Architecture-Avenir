import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import StockPositionsController from '#controllers/stock_positions_controller.js'
import * as repositories from '#config/repositories.js'

const stockPositionsController = new StockPositionsController(
  repositories.holdingRepository,
  repositories.stockRepository
)

router
  .group(() => {
    router
      .get('/', (ctx) => stockPositionsController.getUserPositions(ctx))
      .use(middleware.auth())

    router
      .get('/:symbol', (ctx) => stockPositionsController.getPositionBySymbol(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-positions')
