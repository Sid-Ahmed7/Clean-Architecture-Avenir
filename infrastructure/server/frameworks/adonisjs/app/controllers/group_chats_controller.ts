import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'

import { CreateGroupConversationUseCase } from "#application/usecases/group-chat/CreateGroupConversationUseCase.js"
import { JoinGroupConversationUseCase } from "#application/usecases/group-chat/JoinGroupConversationUseCase.js"
import { SendGroupMessageUseCase } from "#application/usecases/group-chat/SendGroupMessageUseCase.js"
import { GetGroupMessagesUseCase } from "#application/usecases/group-chat/GetGroupMessagesUseCase.js"
import { GetGroupParticipantsUseCase } from "#application/usecases/group-chat/GetGroupParticipantsUseCase.js"
import { GetAllGroupsUseCase } from "#application/usecases/group-chat/GetAllGroupsUseCase.js"
import { GetAllGroupsUnreadCountUseCase } from "#application/usecases/group-chat/GetAllGroupsUnreadCountUseCase.js"
import { MarkGroupMessagesAsReadUseCase } from "#application/usecases/group-chat/MarkGroupMessagesAsReadUseCase.js"

import type { GroupConversationRepositoryInterface } from "#application/ports/repositories/group-chat/GroupConversationRepositoryInterface.js"
import type { GroupMessageRepositoryInterface } from "#application/ports/repositories/group-chat/GroupMessageRepositoryInterface.js"
import type { GroupParticipantRepositoryInterface } from "#application/ports/repositories/group-chat/GroupParticipantRepositoryInterface.js"
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js"
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js"

import { UnauthorizedGroupCreationError } from "#application/errors/UnauthorizedGroupCreationError.js"
import { GroupConversationNotFoundError } from "#application/errors/GroupConversationNotFoundError.js"
import { UserAlreadyInGroupError } from "#application/errors/UserAlreadyInGroupError.js"
import { NotAGroupParticipantError } from "#application/errors/NotAGroupParticipantError.js"

import * as groupChatValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/group_chat.js"
import { AuthContext } from '#types/JwtPayload'

@inject()
export default class GroupChatsController {
  constructor(
    private readonly groupConversationRepository: GroupConversationRepositoryInterface,
    private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
    private readonly groupMessageRepository: GroupMessageRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async createGroup({ request, response, auth }: HttpContext) {
    const userId = auth?.userId
    const roles = auth?.roles ?? []

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const input = await vine.validate({
      schema: groupChatValidator.createGroupValidator,
      data: request.body()
    })

    const createGroupConversationUseCase = new CreateGroupConversationUseCase(
      this.groupConversationRepository,
      this.groupParticipantRepository,
      this.uuidService
    )

    const result = await createGroupConversationUseCase.execute(input.name, userId, roles[0])

    if (result instanceof Error) {
      if (result instanceof UnauthorizedGroupCreationError) {
        return response.status(403).json({ error: result.message })
      }
      return response.status(400).json({ error: result.message })
    }

    return response.status(201).json(result)
  }

  async joinGroup({ params, response, auth }: HttpContext) {
    const groupId = params.groupId as string
    const userId = auth?.userId
    const roles = auth?.roles ?? []

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const joinGroupConversationUseCase = new JoinGroupConversationUseCase(
      this.groupConversationRepository,
      this.groupParticipantRepository,
      this.uuidService
    )

    const result = await joinGroupConversationUseCase.execute(groupId, userId, roles[0])

    if (result instanceof Error) {
      if (result instanceof GroupConversationNotFoundError) {
        return response.status(404).json({ error: result.message })
      }
      if (result instanceof UserAlreadyInGroupError) {
        return response.status(409).json({ error: result.message })
      }
      return response.status(400).json({ error: result.message })
    }

    return response.status(200).json(result)
  }

  async sendMessage({ params, request, response, auth }: HttpContext) {
    const groupId = params.groupId as string
    const userId = auth?.userId
    const roles = auth?.roles ?? []

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const input = await vine.validate({
      schema: groupChatValidator.sendGroupMessageValidator,
      data: request.body()
    })

    const sendGroupMessageUseCase = new SendGroupMessageUseCase(
      this.groupMessageRepository,
      this.groupConversationRepository,
      this.groupParticipantRepository,
      this.userRepository,
      this.uuidService
    )

    const result = await sendGroupMessageUseCase.execute(groupId, userId, roles[0], input.content)

    if (result instanceof Error) {
      if (result instanceof NotAGroupParticipantError) {
        return response.status(403).json({ error: result.message })
      }
      return response.status(400).json({ error: result.message })
    }

    return response.status(201).json(result)
  }

  async getMessages({ params, request, response, auth }: HttpContext) {
    const groupId = params.groupId as string
    const userId = auth?.userId

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const limit = parseInt(request.qs().limit as string) || 50
    const offset = parseInt(request.qs().offset as string) || 0

    const getGroupMessagesUseCase = new GetGroupMessagesUseCase(
      this.groupParticipantRepository,
      this.groupMessageRepository
    )

    const result = await getGroupMessagesUseCase.execute(groupId, userId, limit, offset)

    if (result instanceof Error) {
      if (result instanceof NotAGroupParticipantError) {
        return response.status(403).json({ error: result.message })
      }
      return response.status(400).json({ error: result.message })
    }

    const messagesWithIsManager = result.map(message => ({
      id: message.id,
      groupId: message.groupId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      senderFirstName: message.senderFirstName,
      senderLastName: message.senderLastName,
      content: message.content,
      createdAt: message.createdAt,
      readBy: message.readBy,
      isManager: message.isSentByManager()
    }))

    return response.status(200).json(messagesWithIsManager)
  }

  async getParticipants({ params, response }: HttpContext) {
    const groupId = params.groupId as string

    const getGroupParticipantsUseCase = new GetGroupParticipantsUseCase(
      this.groupParticipantRepository,
      this.userRepository
    )

    const result = await getGroupParticipantsUseCase.execute(groupId)

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message })
    }

    return response.status(200).json(result)
  }

  async getAllGroups({ response, auth }: HttpContext) {
    const userId = auth?.userId

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const getAllGroupsUseCase = new GetAllGroupsUseCase(
      this.groupConversationRepository,
      this.groupParticipantRepository
    )

    const result = await getAllGroupsUseCase.execute(userId)
    return response.status(200).json(result)
  }

  async getUnreadCounts({ response, auth }: HttpContext) {
    const userId = auth?.userId

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const getUnreadCountUseCase = new GetAllGroupsUnreadCountUseCase(
      this.groupMessageRepository,
      this.groupParticipantRepository
    )

    const result = await getUnreadCountUseCase.execute(userId)
    return response.status(200).json(result)
  }

  async markMessagesAsRead({ params, response, auth }: HttpContext) {
    const groupId = params.groupId as string
    const userId = auth?.userId

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" })
    }

    const markAsReadUseCase = new MarkGroupMessagesAsReadUseCase(
      this.groupMessageRepository,
      this.groupParticipantRepository
    )

    const result = await markAsReadUseCase.execute(groupId, userId)

    if (result instanceof NotAGroupParticipantError) {
      return response.status(403).json({ error: result.message })
    }

    return response.status(200).json({ success: true })
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
