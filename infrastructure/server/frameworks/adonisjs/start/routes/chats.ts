import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ChatsController from '#controllers/chats_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const chatsController = new ChatsController(
  repositories.conversationRepository,
  repositories.messageRepository,
  repositories.userRepository,
  repositories.uuidService,
  repositories.notificationRepository,
  repositories.notificationService
)

router
  .group(() => {
    router
      .get('/conversations', (ctx) => chatsController.getPendingConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/conversation/create', (ctx) => chatsController.createConversation(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .post('/send', (ctx) => chatsController.sendMessage(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]))

    router
      .post('/mark-read', (ctx) => chatsController.markMessageAsRead(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .post('/transfer', (ctx) => chatsController.transferConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/conversations/assigned', (ctx) => chatsController.getAdvisorConversation(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/conversations/client', (ctx) => chatsController.getClientConversation(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT]))

    router
      .get('/:conversationId/messages', (ctx) => chatsController.getConversationMessages(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]))
  })
  .prefix('/api/chat')
