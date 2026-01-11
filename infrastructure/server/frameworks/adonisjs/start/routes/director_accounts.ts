import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import DirectorAccountsController from '#controllers/director_accounts_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getDirectorAccountsController = (async () => {
  return new DirectorAccountsController(
    await app.container.make('accountRepository'),
    await app.container.make('savingsAccountRepository'),
    await app.container.make('userRepository')
  )
})()

router
  .group(() => {
    router
      .get('/accounts', async (ctx) => (await getDirectorAccountsController).getAllAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
    router
      .get('/savings-accounts', async (ctx) => (await getDirectorAccountsController).getAllSavingsAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))  })
  .prefix('/api/director')
