import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import NotificationsController from '#controllers/notifications_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getNotificationsController = (async () => {
  return new NotificationsController(
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService'),
    await app.container.make('uuidService'),
    await app.container.make('userRepository')
  )
})()

router
  .group(() => {
    router
      .get('/subscribe', async (ctx) => (await getNotificationsController).subscribe(ctx))
      .use(middleware.auth())

    router
      .post('/create', async (ctx) => (await getNotificationsController).createNotification(ctx))
      .use(middleware.auth())

    router
      .post('/send-notification', async (ctx) => (await getNotificationsController).sendNotificationToClient(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .get('/', async (ctx) => (await getNotificationsController).getUserNotification(ctx))
      .use(middleware.auth())

    router
      .put('/read', async (ctx) => (await getNotificationsController).markNotificationAsRead(ctx))
      .use(middleware.auth())

    router
      .delete('/:id', async (ctx) => (await getNotificationsController).deleteNotification(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/notification')
