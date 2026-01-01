import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SavingsAccountsController from '#controllers/savings_accounts_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const savingsAccountsController = new SavingsAccountsController(
  repositories.savingsAccountRepository,
  repositories.accountRepository,
  repositories.savingsProductRepository,
  repositories.transactionRepository,
  repositories.userRepository,
  repositories.notificationRepository,
  repositories.notificationService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .get('/', (ctx) => savingsAccountsController.getAllSavingsAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.CLIENT]))

    router
      .post('/', (ctx) => savingsAccountsController.createSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber', (ctx) => savingsAccountsController.getSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber', (ctx) => savingsAccountsController.updateSavingsAccountConfig(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/interest-rate', (ctx) => savingsAccountsController.updateInterestRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/max-deposit', (ctx) => savingsAccountsController.updateMaxDeposit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/calculate-interest', (ctx) => savingsAccountsController.calculateDailyInterest(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber/interest-summary', (ctx) => savingsAccountsController.getInterestSummary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/:accountNumber/deposit', (ctx) => savingsAccountsController.depositToSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/:accountNumber/withdraw', (ctx) => savingsAccountsController.withdrawFromSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .delete('/:accountNumber', (ctx) => savingsAccountsController.deleteSavingsAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/savings-accounts')
