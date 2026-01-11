import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateConversationUseCase } from "#application/usecases/chat/CreateConversationUseCase.js";
import { SendMessageUseCase } from "#application/usecases/chat/SendMessageUseCase.js";
import { GetConversationMessagesUseCase } from "#application/usecases/chat/GetConversationMessagesUsecase.js";
import { GetAdvisorConversationUseCase } from "#application/usecases/chat/GetAdvisorConversationUseCase.js";
import { GetClientConversationUseCase } from "#application/usecases/chat/GetClientConversationUseCase.js";
import { MarkMessageAsReadUseCase } from "#application/usecases/chat/MarkMessageAsReadUseCase.js";
import { TransferConversationUseCase } from "#application/usecases/chat/TransferConversationUseCase.js";
import { GetPendingConversationUseCase } from "#application/usecases/chat/GetPendingConversationUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { ConversationRepositoryInterface } from "#application/ports/repositories/chat/ConversationRepositoryInterface.js";
import type { MessageRepositoryInterface } from "#application/ports/repositories/chat/MessageRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import { InvalidMessageError } from "#domain/errors/InvalidMessageError.js";
import { AdvisorAlreadyAssignedError } from "#application/errors/chat/AdvisorAlreadyAssignedError.js";
import { MessageNotFoundError } from "#application/errors/chat/MessageNotFoundError.js";
import { SameAdvisorError } from "#application/errors/chat/SameAdvisorErrror.js";
import { InvalidUserIdError } from "#domain/errors/InvalidUserIdError.js";
import { InvalidConversationError } from "#domain/errors/InvalidConversationError.js";
import { NoAdvisorAssignedError } from "#application/errors/chat/NoAdvisorAssignedError.js";
import { ConversationNotFoundError } from "#application/errors/chat/ConversationNotFoundError.js";
import { UserNotFoundError } from "#application/errors/UserNotFoundError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as chatValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/chat.js";

@inject()
export default class ChatsController {
  constructor(
    private readonly conversationRepository: ConversationRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService
  ) {}

  async createConversation({ response, auth }: HttpContext) {
    const createConversationUseCase = new CreateConversationUseCase(
      this.conversationRepository,
      this.uuidService
    );

    const userId = auth?.userId;
    const role = auth?.roles?.[0];

    if (!userId || !role) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await createConversationUseCase.execute(userId);

    if (result instanceof Error) {
      if (result instanceof InvalidConversationError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof InvalidUserIdError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async sendMessage({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const sendMessageUseCase = new SendMessageUseCase(
      this.conversationRepository,
      this.messageRepository,
      this.uuidService,
      sendNotificationUseCase
    );

    const userId = auth?.userId;
    const role = auth?.roles?.[0];

    if (!userId || !role) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const input = await vine.validate({schema: chatValidator.sendMessageValidator, data: request.body()});
    const result = await sendMessageUseCase.execute(userId, role, input.conversationId, input.content);

    if (result instanceof Error) {
      if (result instanceof InvalidMessageError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof AdvisorAlreadyAssignedError) {
        return response.status(409).json({ error: result.message });
      }

      if (result instanceof NoAdvisorAssignedError) {
        return response.status(409).json({ error: result.message });
      }

      if (result instanceof ConversationNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getPendingConversation({ response }: HttpContext) {
    const getAllPendingConversationUseCase = new GetPendingConversationUseCase(
      this.conversationRepository
    );

    const result = await getAllPendingConversationUseCase.execute();
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAdvisorConversation({ response, auth }: HttpContext) {
    const getAdvisorConversationUseCase = new GetAdvisorConversationUseCase(
      this.conversationRepository,
      this.userRepository
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await getAdvisorConversationUseCase.execute(userId);
    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getClientConversation({ response, auth }: HttpContext) {
    const getClientConversationUseCase = new GetClientConversationUseCase(
      this.conversationRepository,
      this.userRepository
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await getClientConversationUseCase.execute(userId);
    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getConversationMessages({ params, response, auth }: HttpContext) {
  

    const getConversationMessagesUseCase = new GetConversationMessagesUseCase(
      this.conversationRepository,
      this.messageRepository
    );

    const conversationId = params.conversationId;
    const userId = auth?.userId;
    const role = auth?.roles?.[0];

    if (!userId || !role) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    if (!conversationId) {
      return response.status(404).json({ error: "conversation not found" });
    }

    const result = await getConversationMessagesUseCase.execute(conversationId);

    if (result instanceof MessageNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof ConversationNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async markMessageAsRead({ request, response, auth }: HttpContext) {
    const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(this.messageRepository);

    const body = request.body();
    const userId = auth?.userId;
    const role = auth?.roles?.[0];

    if (!userId || !role) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await markMessageAsReadUseCase.execute(body.message);

    if (result instanceof MessageNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async transferConversation({ request, response, auth }: HttpContext) {
    const transferUseCase = new TransferConversationUseCase(this.conversationRepository);

    const userId = auth?.userId;
    const role = auth?.roles?.[0];

    if (!userId || !role) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const input = await vine.validate({schema: chatValidator.transferConversationValidator, data: request.body()});
    const result = await transferUseCase.execute(input.conversationId, input.newAdvisorId);

    if (result instanceof Error) {
      if (result instanceof SameAdvisorError) {
        return response.status(409).json({ error: result.message });
      }

      if (result instanceof ConversationNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
