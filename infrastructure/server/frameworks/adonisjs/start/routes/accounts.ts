import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import AccountsController from '#controllers/accounts_controller'
import { authorizeRoles } from '#middleware/role_middleware'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getAccountsController = await (async () => {
  return new AccountsController(
    await app.container.make('accountRepository'),
    await app.container.make('accountNumberGenerator'),
    await app.container.make('ibanGenerator'),
    await app.container.make('transactionRepository'),
    await app.container.make('overdraftRequestRepository'),
    await app.container.make('loanRequestRepository'),
    await app.container.make('userRepository'),
    await app.container.make('uuidService'),
    await app.container.make('transferLimitService'),
    await app.container.make('transferValidationService'),
    await app.container.make('transactionEnrichmentService'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService'),
    await app.container.make('manageAllowedAccountStatusService'),
    await app.container.make('statusMessageService')
  )
})()

router
  .group(() => {
    router
      .get('/my-accounts', async (ctx) => getAccountsController.getUserAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create', async (ctx) => getAccountsController.createAnAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create/sub', async (ctx) => getAccountsController.createSubAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/update', async (ctx) => getAccountsController.updateAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests', async (ctx) => getAccountsController.getPendingOverdraftRequests(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .put('/overdraft-requests/:requestId/response', async (ctx) => getAccountsController.respondOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests/:requestId/details', async (ctx) => getAccountsController.getOverdraftRequestDetails(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/history', async (ctx) => getAccountsController.getTransactionHistory(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/last', async (ctx) => getAccountsController.getLastTransactions(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/transfer', async (ctx) => getAccountsController.transferBetweenAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/quick-transfer', async (ctx) => getAccountsController.quickTransfer(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/iban/:iban', async (ctx) => getAccountsController.getAccountByIban(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/:accountNumber/overdraft-limit/request', async (ctx) => getAccountsController.requestOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber/rib', async (ctx) => getAccountsController.downloadRib(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .put('/:accountNumber/status', async (ctx) => getAccountsController.changeStatusOfAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/name', async (ctx) => getAccountsController.updateAccountName(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/withdrawal-limit', async (ctx) => getAccountsController.updateWithdrawalLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/transfer-limit', async (ctx) => getAccountsController.updateTransferLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/overdraft-limit', async (ctx) => getAccountsController.updateOverdraftLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/active', async (ctx) => getAccountsController.toggleAccountActive(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber', async (ctx) => getAccountsController.getAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .delete('/:accountNumber', async (ctx) => getAccountsController.deleteAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/', async (ctx) => getAccountsController.getAllAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/accounts')
