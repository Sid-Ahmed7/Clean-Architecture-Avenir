import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import StocksController from '#controllers/stocks_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getStocksController = (async () => {
  return new StocksController(
    await app.container.make('stockRepository'),
    await app.container.make('stockOrderRepository'),
    await app.container.make('orderBookService'),
    await app.container.make('uuidService'),
    await app.container.make('holdingRepository'),
    await app.container.make('accountService')
  )
})()

router
  .group(() => {
    router
      .post('/create', async (ctx) => (await getStocksController).create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/', async (ctx) => (await getStocksController).getAll(ctx))
      .use(middleware.auth())

    router
      .get('/available', async (ctx) => (await getStocksController).listAvailableStocks(ctx))
      .use(middleware.auth())

    router
      .get('/symbol/:symbol', async (ctx) => (await getStocksController).getBySymbol(ctx))
      .use(middleware.auth())

    router
      .get('/:id', async (ctx) => (await getStocksController).getById(ctx))
      .use(middleware.auth())

    router
      .put('/update', async (ctx) => (await getStocksController).update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .delete('/:id', async (ctx) => (await getStocksController).delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .patch('/:id/availability', async (ctx) => (await getStocksController).changeAvailability(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/:symbol/update-price', async (ctx) => (await getStocksController).updatePrice(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/ipo/purchase', async (ctx) => (await getStocksController).purchaseIPO(ctx))
      .use(middleware.auth())

    router
      .post('/:symbol/ipo/close', async (ctx) => (await getStocksController).closeIPO(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/:symbol/ipo/open', async (ctx) => (await getStocksController).launchIPO(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/stocks')
