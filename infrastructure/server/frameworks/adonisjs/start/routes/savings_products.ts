import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import SavingsProductsController from '#controllers/savings_products_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getSavingsProductsController = (async () => {
  return new SavingsProductsController(
    await app.container.make('savingsProductRepository'),
    await app.container.make('savingsAccountRepository'),
    await app.container.make('accountRepository'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .post('/', async (ctx) => (await getSavingsProductsController).createProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router.get('/', async (ctx) => (await getSavingsProductsController).getAllProducts(ctx))

    router
      .put('/:productId', async (ctx) => (await getSavingsProductsController).updateProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/subscribe', async (ctx) => (await getSavingsProductsController).subscribeToProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))
  })
  .prefix('/api/savings-products')
