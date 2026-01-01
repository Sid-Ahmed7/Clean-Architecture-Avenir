import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import StockOrdersController from '#controllers/stock_orders_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const stockOrdersController = new StockOrdersController(
  repositories.stockOrderRepository,
  repositories.stockTransactionRepository,
  repositories.stockRepository,
  repositories.holdingRepository,
  repositories.matchingService,
  repositories.orderBookService,
  repositories.orderValidationService,
  repositories.accountService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .post('/create', (ctx) => stockOrdersController.placeOrder(ctx))
      .use(middleware.auth())

    router
      .get('/', (ctx) => stockOrdersController.getUserOrders(ctx))
      .use(middleware.auth())

    router
      .get('/all', (ctx) => stockOrdersController.getAllOrders(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/book/:symbol', (ctx) => stockOrdersController.getOrderBookBySymbol(ctx))
      .use(middleware.auth())

    router
      .post('/match/:symbol', (ctx) => stockOrdersController.matchOrders(ctx))
      .use(middleware.auth())

    router
      .patch('/:id/cancel', (ctx) => stockOrdersController.cancelOrder(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-orders')
