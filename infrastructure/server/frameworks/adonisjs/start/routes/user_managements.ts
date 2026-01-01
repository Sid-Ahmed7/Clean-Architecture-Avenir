import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import UserManagementsController from '#controllers/user_managements_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const userManagementsController = new UserManagementsController(
  repositories.userRepository,
  repositories.roleRepository,
  repositories.userRoleRepository,
  repositories.accountRepository,
  repositories.savingsAccountRepository,
  repositories.notificationRepository,
  repositories.notificationService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .get('/', (ctx) => userManagementsController.getAllUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/clients', (ctx) => userManagementsController.getClientUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/advisors', (ctx) => userManagementsController.getAdvisorUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:id', (ctx) => userManagementsController.updateUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .delete('/:id', (ctx) => userManagementsController.deleteUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/user-management')
