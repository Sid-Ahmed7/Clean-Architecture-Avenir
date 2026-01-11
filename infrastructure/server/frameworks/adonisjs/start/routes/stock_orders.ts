import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import StockOrdersController from '#controllers/stock_orders_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getStockOrdersController = (async () => {
  return new StockOrdersController(
    await app.container.make('stockOrderRepository'),
    await app.container.make('stockTransactionRepository'),
    await app.container.make('stockRepository'),
    await app.container.make('holdingRepository'),
    await app.container.make('matchingService'),
    await app.container.make('orderBookService'),
    await app.container.make('orderValidationService'),
    await app.container.make('accountService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .post('/create', async (ctx) => (await getStockOrdersController).placeOrder(ctx))
      .use(middleware.auth())

    router
      .get('/', async (ctx) => (await getStockOrdersController).getUserOrders(ctx))
      .use(middleware.auth())

    router
      .get('/all', async (ctx) => (await getStockOrdersController).getAllOrders(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/book/:symbol', async (ctx) => (await getStockOrdersController).getOrderBookBySymbol(ctx))
      .use(middleware.auth())

    router
      .post('/match/:symbol', async (ctx) => (await getStockOrdersController).matchOrders(ctx))
      .use(middleware.auth())

    router
      .patch('/:id/cancel', async (ctx) => (await getStockOrdersController).cancelOrder(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-orders')
