import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import LoansController from '#controllers/loans_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const loansController = new LoansController(
  repositories.loanRequestRepository,
  repositories.userRepository,
  repositories.userRoleRepository,
  repositories.uuidService,
  repositories.accountRepository,
  repositories.loanConfigService,
  repositories.loanRepaymentScheduleRepository,
  repositories.notificationRepository,
  repositories.notificationService
)

router
  .group(() => {
    router
      .post('/request', (ctx) => loansController.createLoanRequest(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))
    router
      .get('/advisor/requests', (ctx) => loansController.listForAdvisor(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .get('/client/requests', (ctx) => loansController.listForClient(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/client/:id/requests', (ctx) => loansController.listClientHistory(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/client/:id/repayments', (ctx) => loansController.listClientRepaymentsById(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/advisor/requests/:id/decision', (ctx) => loansController.advisorDecision(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/director/requests/:id/decision', (ctx) => loansController.directorDecision(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/director/requests', (ctx) => loansController.listForDirector(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/director/requests/:id/propose-rate', (ctx) => loansController.directorProposeRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/client/requests/:id/respond', (ctx) => loansController.clientRespondProposal(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/director/rate', (ctx) => loansController.setIndicativeRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/rate', (ctx) => loansController.getIndicativeRate(ctx))
      .use(middleware.auth())

    router
      .get('/client/repayments', (ctx) => loansController.listClientRepayments(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/client/:id/info', (ctx) => loansController.getClientInfo(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/loans')
