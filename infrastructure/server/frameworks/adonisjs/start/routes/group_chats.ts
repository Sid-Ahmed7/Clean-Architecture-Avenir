import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import GroupChatsController from '#controllers/group_chats_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'

const getGroupChatsController = (async () => {
  return new GroupChatsController(
    await app.container.make('groupConversationRepository'),
    await app.container.make('groupParticipantRepository'),
    await app.container.make('groupMessageRepository'),
    await app.container.make('userRepository'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .get('/', async (ctx) => (await getGroupChatsController).getAllGroups(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/unread-counts', async (ctx) => (await getGroupChatsController).getUnreadCounts(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/create', async (ctx) => (await getGroupChatsController).createGroup(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_MANAGER]))

    router
      .post('/:groupId/join', async (ctx) => (await getGroupChatsController).joinGroup(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/:groupId/message', async (ctx) => (await getGroupChatsController).sendMessage(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .post('/:groupId/mark-read', async (ctx) => (await getGroupChatsController).markMessagesAsRead(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/:groupId/messages', async (ctx) => (await getGroupChatsController).getMessages(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))

    router
      .get('/:groupId/participants', async (ctx) => (await getGroupChatsController).getParticipants(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/group-chat')