import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import NotificationsController from '#controllers/notifications_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const notificationsController = new NotificationsController(
  repositories.notificationRepository,
  repositories.notificationService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .get('/subscribe', (ctx) => notificationsController.subscribe(ctx))
      .use(middleware.auth())

    router
      .post('/create', (ctx) => notificationsController.createNotification(ctx))
      .use(middleware.auth())

    router
      .post('/send-notification', (ctx) => notificationsController.sendNotificationToClient(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .get('/', (ctx) => notificationsController.getUserNotification(ctx))
      .use(middleware.auth())

    router
      .put('/read', (ctx) => notificationsController.markNotificationAsRead(ctx))
      .use(middleware.auth())

    router
      .delete('/:id', (ctx) => notificationsController.deleteNotification(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/notification')
