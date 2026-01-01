import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AccountsController from '#controllers/accounts_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const accountsController = new AccountsController(
  repositories.accountRepository,
  repositories.accountNumberGenerator,
  repositories.ibanGenerator,
  repositories.transactionRepository,
  repositories.overdraftRequestRepository,
  repositories.loanRequestRepository,
  repositories.userRepository,
  repositories.uuidService,
  repositories.transferLimitService,
  repositories.transferValidationService,
  repositories.transactionEnrichmentService,
  repositories.notificationRepository,
  repositories.notificationService
)

router
  .group(() => {
    router
      .get('/my-accounts', (ctx) => accountsController.getUserAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create', (ctx) => accountsController.createAnAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/create/sub', (ctx) => accountsController.createSubAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/update', (ctx) => accountsController.updateAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests', (ctx) => accountsController.getPendingOverdraftRequests(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .put('/overdraft-requests/:requestId/response', (ctx) => accountsController.respondOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/overdraft-requests/:requestId/details', (ctx) => accountsController.getOverdraftRequestDetails(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/history', (ctx) => accountsController.getTransactionHistory(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/transactions/last', (ctx) => accountsController.getLastTransactions(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/transfer', (ctx) => accountsController.transferBetweenAccounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/quick-transfer', (ctx) => accountsController.quickTransfer(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/iban/:iban', (ctx) => accountsController.getAccountByIban(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/:accountNumber/overdraft-limit/request', (ctx) => accountsController.requestOverdraftIncrease(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber/rib', (ctx) => accountsController.downloadRib(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .put('/:accountNumber/status', (ctx) => accountsController.changeStatusOfAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/name', (ctx) => accountsController.updateAccountName(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/withdrawal-limit', (ctx) => accountsController.updateWithdrawalLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/transfer-limit', (ctx) => accountsController.updateTransferLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/overdraft-limit', (ctx) => accountsController.updateOverdraftLimit(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:accountNumber/active', (ctx) => accountsController.toggleAccountActive(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/:accountNumber', (ctx) => accountsController.getAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .delete('/:accountNumber', (ctx) => accountsController.deleteAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/', (ctx) => accountsController.getAllAccount(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/accounts')
