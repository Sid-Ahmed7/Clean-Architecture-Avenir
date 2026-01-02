import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import type { InMemoryNotificationRepository } from '#infrastructure/adapters/repositories/InMemoryNotificationRepository.js'
import type { NotificationPublisher } from '#application/ports/services/notification/NotificationPublisher.js'
import { SseClient } from '#application/ports/services/notification/NotificationPublisher.js'
import { CreateNotificationUseCase } from '#application/usecases/notification/CreateNotificationUseCase.js'
import { GetUserNotificationUseCase } from '#application/usecases/notification/GetUserNotificationUseCase.js'
import { SendNotificationToClientUseCase } from '#application/usecases/notification/SendNotificationToClientUseCase.js'
import { MarkNotificationAsReadUseCase } from '#application/usecases/notification/MarkNotificationAsReadUseCase.js'
import { DeleteNotificationUseCase } from '#application/usecases/notification/DeleteNotificationUseCase.js'
import { InvalidNotificationError } from '#domain/errors/InvalidNotificationError.js'
import { InvalidUserIdError } from '#domain/errors/InvalidUserIdError.js'
import { NotificationNotFoundError } from '#application/errors/notification/NotificationNotFoundError.js'
import type { CryptoUuidGenerator } from '#infrastructure/adapters/services/CryptoUuidGenerator.js'
import type { UserRepositoryInterface } from '#application/ports/repositories/auth/UserRepositoryInterface.js'
import {
  createNotificationValidator,
  sendNotificationToClientValidator,
  markNotificationAsReadValidator
} from '#validators/notification.js'
import vine from '@vinejs/vine'
import { AuthContext } from '#types/JwtPayload'

@inject()
export default class NotificationsController {
  public constructor(
    private readonly notificationRepository: InMemoryNotificationRepository,
    private readonly notificationService: NotificationPublisher,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async createNotification({ request, response, auth }: HttpContext) {
    const createNotificationUseCase = new CreateNotificationUseCase(
      this.notificationRepository,
      this.uuidService
    )
    const userId = auth?.userId

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized access' })
    }

    const input = await vine.validate({ schema: createNotificationValidator, data: request.body() })
    const { message, type } = input

    const result = await createNotificationUseCase.execute(userId, message, type)

    if (result instanceof Error) {
      if (result instanceof InvalidNotificationError) {
        return response.status(400).json({ error: result.message })
      }
      if (result instanceof InvalidUserIdError) {
        return response.status(401).json({ error: result.message })
      }

      return response.status(500).json({ error: result.message })
    }

    this.notificationService.sendNotification(userId, result)
    return response.status(201).json(result)
  }

  public async sendNotificationToClient({ request, response, auth }: HttpContext) {
    const senderNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    )
    const advisorId = auth?.userId;

    if (!advisorId) {
      return response.status(401).json({ error: 'Unauthorized access' })
    }

    const input = await vine.validate({ schema: sendNotificationToClientValidator, data: request.body() })
    const { clientId, message, type } = input

    const result = await senderNotificationUseCase.execute(clientId, message, type, advisorId)

    if (result instanceof Error) {
      if (result instanceof InvalidNotificationError) {
        return response.status(400).json({ error: result.message })
      }
      if (result instanceof InvalidUserIdError) {
        return response.status(401).json({ error: result.message })
      }

      return response.status(500).json({ error: result.message })
    }

    return response.status(201).json(result)
  }

  public async getUserNotification({ response, auth }: HttpContext) {
    const getUserNotificationUseCase = new GetUserNotificationUseCase(this.notificationRepository)
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized access' })
    }

    const result = await getUserNotificationUseCase.execute(userId)

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message })
    }

    return response.status(200).json(result)
  }

  public async markNotificationAsRead({ request, response, auth }: HttpContext) {
    const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(
      this.notificationRepository
    )
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized access' })
    }

    const input = await vine.validate({ schema: markNotificationAsReadValidator, data: request.body() })
    const { notificationId } = input

    const result = await markNotificationAsReadUseCase.execute(notificationId)

    if (result instanceof Error) {
      if (result instanceof NotificationNotFoundError) {
        return response.status(404).json({ error: result.message })
      }
      return response.status(500).json({ error: result.message })
    }

    return response.status(200).json(result)
  }

  public async deleteNotification({ params, response }: HttpContext) {
    const deleteNotificationUseCase = new DeleteNotificationUseCase(this.notificationRepository)

    const notificationId = params.id
    if (!notificationId) {
      return response.status(404).json({ error: 'Notification not found' })
    }

    const result = await deleteNotificationUseCase.execute(notificationId)

    if (result instanceof Error) {
      if (result instanceof NotificationNotFoundError) {
        return response.status(404).json({ error: result.message })
      }
      return response.status(500).json({ error: result.message })
    }

    return response.status(200).json(result)
  }

  public subscribe({ response, auth, request }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized access' })
    }

    response.response.writeHead(200, {
      'Access-Control-Allow-Origin': process.env.CLIENT_BASE_URL || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    })

    const client: SseClient = {
      write: (data: string) => response.response.write(data),
      close: () => response.response.end(),
    }

    this.notificationService.subscribe(userId, client)

    request.request.on('close', () => {
      this.notificationService.unsubscribe(userId, client)
    })
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
