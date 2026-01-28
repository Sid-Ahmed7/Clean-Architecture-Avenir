import { Server, Socket } from 'socket.io'
import SocketMiddleware from '#middleware/socket_middleware.js'
import { GetUserGroupsUseCase } from '#application/usecases/group-chat/GetUserGroupsUseCase.js'
import { SendGroupMessageUseCase } from '#application/usecases/group-chat/SendGroupMessageUseCase.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'

interface Identification {
  userId: string
  role: string
}

interface GroupMessage {
  groupId: string
  content: string
}

interface GroupTyping {
  groupId: string
  userId: string
  firstName: string
  lastName: string
  isManager: boolean
}

const groupChatUsers: Map<string, Set<string>> = new Map()
const users: Record<string, string[]> = {}

export const groupChatSocketSetup = async (io: Server) => {
  const groupConversationRepository = await app.container.make('groupConversationRepository')
  const groupParticipantRepository = await app.container.make('groupParticipantRepository')
  const groupMessageRepository = await app.container.make('groupMessageRepository')
  const userRepository = await app.container.make('userRepository')
  const uuidService = await app.container.make('uuidService')

  const groupChatIo = io.of('/group-chat')

  const socketMiddleware = new SocketMiddleware()
  groupChatIo.use((socket, next) => socketMiddleware.handle(socket, next))

  // Middleware to check group participation for specific events
  const EVENTS_REQUIRING_PARTICIPANT_CHECK = ['sendGroupMessage', 'typing', 'stopTyping']

  groupChatIo.use((socket: Socket, next) => {
    socket.use(async ([event, ...args], eventNext) => {
      if (!EVENTS_REQUIRING_PARTICIPANT_CHECK.includes(event)) {
        return eventNext()
      }

      const user = socket.data.user
      if (!user?.userId) {
        return eventNext(new Error('User not authenticated'))
      }

      const groupId = typeof args[0] === 'string' ? args[0] : args[0]?.groupId

      if (!groupId) {
        return eventNext(new Error('Group ID required'))
      }

      try {
        const isParticipant = await groupParticipantRepository.isParticipant(groupId, user.userId)

        if (!isParticipant) {
          return eventNext(new Error('Not a participant of this group'))
        }

        eventNext()
      } catch (_error) {
        eventNext(new Error('Failed to verify group participation'))
      }
    })

    next()
  })

  groupChatIo.on('connection', (socket: Socket) => {
    const user = socket.data.user
    if (!user?.userId) {
      socket.disconnect(true)
      return
    }

    socket.on(
      'identification',
      async (
        data: Identification,
        callback?: (res: { success?: boolean; error?: string }) => void
      ) => {
        try {
          users[data.userId] = [...(users[data.userId] ?? []), socket.id]
          const getUserGroupsUseCase = new GetUserGroupsUseCase(groupParticipantRepository)

          const userGroups = await getUserGroupsUseCase.execute(user.userId)

          userGroups.forEach((participant) => {
            const roomName = `group_${participant.groupId}`
            socket.join(roomName)

            if (!groupChatUsers.has(participant.groupId)) {
              groupChatUsers.set(participant.groupId, new Set())
            }
            groupChatUsers.get(participant.groupId)!.add(user.userId)

            socket.to(roomName).emit('userJoined', {
              userId: user.userId,
              role: data.role,
              isManager: data.role === RoleEnum.BANK_MANAGER,
            })
          })

          socket.emit('userGroups', userGroups)

          callback?.({ success: true })
        } catch (err) {
          callback?.({ error: err instanceof Error ? err.message : 'Unknown error' })
        }
      }
    )

    socket.on('joinGroup', async (groupId: string) => {
      const roomName = `group_${groupId}`
      socket.join(roomName)

      if (!groupChatUsers.has(groupId)) {
        groupChatUsers.set(groupId, new Set())
      }

      groupChatUsers.get(groupId)!.add(user.userId)

      socket.to(roomName).emit('userJoined', {
        userId: user.userId,
        role: user.roles[0],
        isManager: user.roles[0] === RoleEnum.BANK_MANAGER,
      })

      socket.emit('onlineUsers', Array.from(groupChatUsers.get(groupId) || []))

      socket.to(roomName).emit('userJoined', {
        groupId: groupId,
        userId: user.userId,
        userName: user.firstName + ' ' + user.lastName,
      })
    })

    socket.on('sendGroupMessage', async (data: GroupMessage) => {
      const sendGroupMessageUseCase = new SendGroupMessageUseCase(
        groupMessageRepository,
        groupConversationRepository,
        groupParticipantRepository,
        userRepository,
        uuidService
      )
      const result = await sendGroupMessageUseCase.execute(
        data.groupId,
        user.userId,
        user.roles[0],
        data.content
      )
      if (result instanceof Error) {
        return socket.emit('error', { message: result.message })
      }

      const roomName = `group_${data.groupId}`
      groupChatIo.to(roomName).emit('newGroupMessage', {
        ...result,
        isManager: result.senderRole === RoleEnum.BANK_MANAGER,
      })
    })

    socket.on('typing', (data: GroupTyping) => {
      const roomName = `group_${data.groupId}`
      socket.to(roomName).emit('userTyping', {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        isManager: data.isManager,
      })
    })

    socket.on('stopTyping', (data: GroupTyping) => {
      const roomName = `group_${data.groupId}`
      socket.to(roomName).emit('userStopTyping', {
        userId: data.userId,
      })
    })

    socket.on('leavingChatGroup', (groupId: string) => {
      const roomName = `group_${groupId}`
      socket.leave(roomName)

      if (groupChatUsers.has(groupId)) {
        groupChatUsers.get(groupId)!.delete(user.userId)
      }
      groupChatIo.to(roomName).emit('userLeft', {
        userId: user.userId,
      })
    })

    socket.on('disconnect', () => {
      users[user.userId] = (users[user.userId] ?? []).filter((id) => id !== socket.id)
      groupChatUsers.forEach((userSet, groupId) => {
        if (userSet.has(user.userId)) {
          userSet.delete(user.userId)
          const roomName = `group_${groupId}`
          groupChatIo.to(roomName).emit('userLeft', {
            userId: user.userId,
          })
        }
      })
    })
  })
}
