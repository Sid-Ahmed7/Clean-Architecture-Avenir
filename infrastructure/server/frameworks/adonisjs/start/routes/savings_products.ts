import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SavingsProductsController from '#controllers/savings_products_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const savingsProductsController = new SavingsProductsController(
  repositories.savingsProductRepository,
  repositories.savingsAccountRepository,
  repositories.accountRepository,
  repositories.uuidService
)

router
  .group(() => {
    router
      .post('/', (ctx) => savingsProductsController.createProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router.get('/', (ctx) => savingsProductsController.getAllProducts(ctx))

    router
      .put('/:productId', (ctx) => savingsProductsController.updateProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/subscribe', (ctx) => savingsProductsController.subscribeToProduct(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))
  })
  .prefix('/api/savings-products')
