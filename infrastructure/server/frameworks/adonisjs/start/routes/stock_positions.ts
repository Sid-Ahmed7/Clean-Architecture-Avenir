import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import StockPositionsController from '#controllers/stock_positions_controller.js'
import app from '@adonisjs/core/services/app'


const getStockPositionsController = (async () => {
  return new StockPositionsController(
    await app.container.make('holdingRepository'),
    await app.container.make('stockRepository')
  )
})()

router
  .group(() => {
    router
      .get('/', async (ctx) => (await getStockPositionsController).getUserPositions(ctx))
      .use(middleware.auth())

    router
      .get('/:symbol', async (ctx) => (await getStockPositionsController).getPositionBySymbol(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-positions')
