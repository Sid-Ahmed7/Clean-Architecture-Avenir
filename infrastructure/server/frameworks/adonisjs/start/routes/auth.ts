import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'

const getAuthController = (async () => {
  return new AuthController(
    await app.container.make('userRepository'),
    await app.container.make('roleRepository'),
    await app.container.make('userRoleRepository'),
    await app.container.make('tokenService'),
    await app.container.make('passwordService'),
    await app.container.make('emailService'),
    await app.container.make('emailTemplateService'),
    await app.container.make('registrationTokenGeneratorService'),
    await app.container.make('localeService'),
    await app.container.make('uuidService'),
    await app.container.make('eventBus'),
    await app.container.make('rolePriorityService'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService')
  )
})()

router
  .group(() => {
    router.post('/register', async (ctx) => (await getAuthController).register(ctx))
    router.get('/confirm', async (ctx) => (await getAuthController).confirmRegistration(ctx))
    router.post('/login', async (ctx) => (await getAuthController).login(ctx))
    router.post('/refresh-token', async (ctx) => (await getAuthController).refreshToken(ctx))

    router
      .get('/profile', async (ctx) => (await getAuthController).getUserProfile(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/logout', async (ctx) => (await getAuthController).logout(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .get('/getAdvisors', async (ctx) => (await getAuthController).getAdvisors(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/create-advisor', async (ctx) => (await getAuthController).registerAdvisor(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/create-manager', async (ctx) => (await getAuthController).registerManager(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/auth')
