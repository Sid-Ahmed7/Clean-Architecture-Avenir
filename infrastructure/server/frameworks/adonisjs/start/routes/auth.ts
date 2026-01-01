import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const authController = new AuthController(
  repositories.userRepository,
  repositories.roleRepository,
  repositories.userRoleRepository,
  repositories.tokenService,
  repositories.passwordService,
  repositories.emailService,
  repositories.emailTemplateService,
  repositories.registrationTokenGeneratorService,
  repositories.localeService,
  repositories.uuidService,
  repositories.eventBus,
  repositories.rolePriorityService,
  repositories.notificationRepository,
  repositories.notificationService
)

router
  .group(() => {
    router.post('/register', (ctx) => authController.register(ctx))
    router.get('/confirm', (ctx) => authController.confirmRegistration(ctx))
    router.post('/login', (ctx) => authController.login(ctx))
    router.post('/refresh-token', (ctx) => authController.refreshToken(ctx))

    router
      .get('/profile', (ctx) => authController.getUserProfile(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/logout', (ctx) => authController.logout(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]))

    router
      .get('/getAdvisors', (ctx) => authController.getAdvisors(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/create-advisor', (ctx) => authController.registerAdvisor(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/create-manager', (ctx) => authController.registerManager(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/auth')
