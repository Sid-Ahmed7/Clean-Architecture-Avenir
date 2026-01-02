import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import AccountsController from '#controllers/accounts_controller'
import { authorizeRoles } from '#middleware/role_middleware'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getAccountsController = (async () => {
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
    await app.container.make('notificationService')
  )
})()

router
  .group(() => {
    router
      .get('/my-accounts', async (ctx) => (await getAccountsController).getUserAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create', async (ctx) => (await getAccountsController).createAnAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create/sub', async (ctx) => (await getAccountsController).createSubAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/update', async (ctx) => (await getAccountsController).updateAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests', async (ctx) => (await getAccountsController).getPendingOverdraftRequests(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .put('/overdraft-requests/:requestId/response', async (ctx) => (await getAccountsController).respondOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests/:requestId/details', async (ctx) => (await getAccountsController).getOverdraftRequestDetails(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/history', async (ctx) => (await getAccountsController).getTransactionHistory(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/last', async (ctx) => (await getAccountsController).getLastTransactions(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/transfer', async (ctx) => (await getAccountsController).transferBetweenAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/quick-transfer', async (ctx) => (await getAccountsController).quickTransfer(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/iban/:iban', async (ctx) => (await getAccountsController).getAccountByIban(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/:accountNumber/overdraft-limit/request', async (ctx) => (await getAccountsController).requestOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber/rib', async (ctx) => (await getAccountsController).downloadRib(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .put('/:accountNumber/status', async (ctx) => (await getAccountsController).changeStatusOfAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/name', async (ctx) => (await getAccountsController).updateAccountName(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/withdrawal-limit', async (ctx) => (await getAccountsController).updateWithdrawalLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/transfer-limit', async (ctx) => (await getAccountsController).updateTransferLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/overdraft-limit', async (ctx) => (await getAccountsController).updateOverdraftLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/active', async (ctx) => (await getAccountsController).toggleAccountActive(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber', async (ctx) => (await getAccountsController).getAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .delete('/:accountNumber', async (ctx) => (await getAccountsController).deleteAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/', async (ctx) => (await getAccountsController).getAllAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/accounts')
