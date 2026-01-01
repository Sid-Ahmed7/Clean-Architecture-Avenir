import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import DirectorAccountsController from '#controllers/director_accounts_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const directorAccountsController = new DirectorAccountsController(
  repositories.accountRepository,
  repositories.savingsAccountRepository,
  repositories.userRepository
)

router
  .group(() => {
    router
      .get('/accounts', (ctx) => directorAccountsController.getAllAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
    router
      .get('/savings-accounts', (ctx) => directorAccountsController.getAllSavingsAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))  })
  .prefix('/api/director')
