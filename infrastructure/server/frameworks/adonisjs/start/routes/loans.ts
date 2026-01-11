import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import LoansController from '#controllers/loans_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getLoansController = (async () => {
  return new LoansController(
    await app.container.make('loanRequestRepository'),
    await app.container.make('userRepository'),
    await app.container.make('userRoleRepository'),
    await app.container.make('uuidService'),
    await app.container.make('accountRepository'),
    await app.container.make('loanConfigService'),
    await app.container.make('loanRepaymentScheduleRepository'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService')
  )
})()

router
  .group(() => {
    router
      .post('/request', async (ctx) => (await getLoansController).createLoanRequest(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))
    router
      .get('/advisor/requests', async (ctx) => (await getLoansController).listForAdvisor(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .get('/client/requests', async (ctx) => (await getLoansController).listForClient(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/client/:id/requests', async (ctx) => (await getLoansController).listClientHistory(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/client/:id/repayments', async (ctx) => (await getLoansController).listClientRepaymentsById(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/advisor/requests/:id/decision', async (ctx) => (await getLoansController).advisorDecision(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/director/requests/:id/decision', async (ctx) => (await getLoansController).directorDecision(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/director/requests', async (ctx) => (await getLoansController).listForDirector(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/director/requests/:id/propose-rate', async (ctx) => (await getLoansController).directorProposeRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/client/requests/:id/respond', async (ctx) => (await getLoansController).clientRespondProposal(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/director/rate', async (ctx) => (await getLoansController).setIndicativeRate(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/rate', async (ctx) => (await getLoansController).getIndicativeRate(ctx))
      .use(middleware.auth())

    router
      .get('/client/repayments', async (ctx) => (await getLoansController).listClientRepayments(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/client/:id/info', async (ctx) => (await getLoansController).getClientInfo(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/loans')
