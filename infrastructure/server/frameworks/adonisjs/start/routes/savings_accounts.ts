import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import SavingsAccountsController from '#controllers/savings_accounts_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getSavingsAccountsController = (async () => {
  return new SavingsAccountsController(
    await app.container.make('savingsAccountRepository'),
    await app.container.make('accountRepository'),
    await app.container.make('savingsProductRepository'),
    await app.container.make('transactionRepository'),
    await app.container.make('userRepository'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .get('/', async (ctx) => (await getSavingsAccountsController).getAllSavingsAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.CLIENT]))

    router
      .post('/', async (ctx) => (await getSavingsAccountsController).createSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber', async (ctx) => (await getSavingsAccountsController).getSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber', async (ctx) => (await getSavingsAccountsController).updateSavingsAccountConfig(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/interest-rate', async (ctx) => (await getSavingsAccountsController).updateInterestRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/max-deposit', async (ctx) => (await getSavingsAccountsController).updateMaxDeposit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/calculate-interest', async (ctx) => (await getSavingsAccountsController).calculateDailyInterest(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber/interest-summary', async (ctx) => (await getSavingsAccountsController).getInterestSummary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/:accountNumber/deposit', async (ctx) => (await getSavingsAccountsController).depositToSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/:accountNumber/withdraw', async (ctx) => (await getSavingsAccountsController).withdrawFromSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .delete('/:accountNumber', async (ctx) => (await getSavingsAccountsController).deleteSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/savings-accounts')
