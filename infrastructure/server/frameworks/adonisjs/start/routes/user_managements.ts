import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import UserManagementsController from '#controllers/user_managements_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getUserManagementsController = (async () => {
  return new UserManagementsController(
    await app.container.make('userRepository'),
    await app.container.make('roleRepository'),
    await app.container.make('userRoleRepository'),
    await app.container.make('accountRepository'),
    await app.container.make('savingsAccountRepository'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .get('/', async (ctx) => (await getUserManagementsController).getAllUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/clients', async (ctx) => (await getUserManagementsController).getClientUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .get('/advisors', async (ctx) => (await getUserManagementsController).getAdvisorUsers(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .put('/:id', async (ctx) => (await getUserManagementsController).updateUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .delete('/:id', async (ctx) => (await getUserManagementsController).deleteUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  })
    router
      .put('/:id/ban', async (ctx) => (await getUserManagementsController).banUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))


    router
      .put('/:id/unban', async (ctx) => (await getUserManagementsController).unbanUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))
  .prefix('/api/user-management')
