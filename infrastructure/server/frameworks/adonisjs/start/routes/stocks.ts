import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import StocksController from '#controllers/stocks_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const stocksController = new StocksController(
  repositories.stockRepository,
  repositories.stockOrderRepository,
  repositories.orderBookService,
  repositories.uuidService,
  repositories.holdingRepository,
  repositories.accountService
)

router
  .group(() => {
    router
      .post('/create', (ctx) => stocksController.create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/', (ctx) => stocksController.getAll(ctx))
      .use(middleware.auth())

    router
      .get('/available', (ctx) => stocksController.listAvailableStocks(ctx))
      .use(middleware.auth())

    router
      .get('/symbol/:symbol', (ctx) => stocksController.getBySymbol(ctx))
      .use(middleware.auth())

    router
      .get('/:id', (ctx) => stocksController.getById(ctx))
      .use(middleware.auth())

    router
      .put('/update', (ctx) => stocksController.update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .delete('/:id', (ctx) => stocksController.delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .patch('/:id/availability', (ctx) => stocksController.changeAvailability(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/:symbol/update-price', (ctx) => stocksController.updatePrice(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/ipo/purchase', (ctx) => stocksController.purchaseIPO(ctx))
      .use(middleware.auth())

    router
      .post('/:symbol/ipo/close', (ctx) => stocksController.closeIPO(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/:symbol/ipo/open', (ctx) => stocksController.launchIPO(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/stocks')
