import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import ChatsController from '#controllers/chats_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getChatsController = (async () => {
  return new ChatsController(
    await app.container.make('conversationRepository'),
    await app.container.make('messageRepository'),
    await app.container.make('userRepository'),
    await app.container.make('uuidService'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService')
  )
})()

router
  .group(() => {
    router
      .get('/conversations', async (ctx) => (await getChatsController).getPendingConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/conversation/create', async (ctx) => (await getChatsController).createConversation(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/send', async (ctx) => (await getChatsController).sendMessage(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]))

    router
      .post('/mark-read', async (ctx) => (await getChatsController).markMessageAsRead(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/transfer', async (ctx) => (await getChatsController).transferConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/conversations/assigned', async (ctx) => (await getChatsController).getAdvisorConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/conversations/client', async (ctx) => (await getChatsController).getClientConversation(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/:conversationId/messages', async (ctx) => (await getChatsController).getConversationMessages(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]))
  })
  .prefix('/api/chat')
