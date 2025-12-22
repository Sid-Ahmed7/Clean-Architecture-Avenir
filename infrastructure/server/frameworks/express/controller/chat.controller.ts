import { Request, Response } from "express";
import { CreateConversationUseCase } from "../../../../../application/usecases/chat/CreateConversationUseCase";
import { SendMessageUseCase } from "../../../../../application/usecases/chat/SendMessageUseCase";
import { GetConversationMessagesUseCase } from "../../../../../application/usecases/chat/GetConversationMessagesUseCase";
import { GetAdvisorConversationUseCase } from "../../../../../application/usecases/chat/GetAdvisorConversationUseCase";
import { GetClientConversationUseCase } from "../../../../../application/usecases/chat/GetClientConversationUseCase";
import { MarkMessageAsReadUseCase } from "../../../../../application/usecases/chat/MarkMessageAsReadUseCase";
import { TransferConversationUseCase } from "../../../../../application/usecases/chat/TransferConversationUseCase";
import { GetPendingConversationUseCase } from "../../../../../application/usecases/chat/GetPendingConversationUseCase";
import { InvalidMessageError } from "../../../../../domain/errors/InvalidMessageError";
import { AdvisorAlreadyAssignedError } from "../../../../../application/errors/chat/AdvisorAlreadyAssignedError";
import { MessageNotFoundError } from "../../../../../application/errors/chat/MessageNotFoundError";
import { SameAdvisorError } from "../../../../../application/errors/chat/SameAdvisorErrror";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";
import { Server } from "socket.io";
import { ClientsSocket } from "../interfaces/ClientSocket";
import { OnlineUser } from "../interfaces/OnlineUser";
import { InvalidConversationError } from "../../../../../domain/errors/InvalidConversationError";
import { error } from "console";
import { NoAdvisorAssignedError } from "../../../../../application/errors/chat/NoAdvisorAssignedError";
import { ConversationNotFoundError } from "../../../../../application/errors/chat/ConversationNotFoundError";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { InMemoryUserRepository } from "../../../../adapters/repositories/InMemoryUserRepository";
import { InMemoryConversationRepository } from "../../../../adapters/repositories/InMemoryConversationRepository";
import { InMemoryMessageRepository } from "../../../../adapters/repositories/InMemoryMessageRepository";
import {CryptoUuidGenerator} from "../../../../adapters/services/CryptoUuidGenerator";
import { sendMessageSchema } from "../schemas/chat/sendMessageSchema";
import { transferConversationSchema } from "../schemas/chat/transferConversationSchema";
import { InMemoryNotificationRepository } from "../../../../adapters/repositories/InMemoryNotificationRepository";
import { NotificationService } from "../../../../adapters/services/notification/NotificationService";
import { SendNotificationToClientUseCase } from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
export class ChatController {
    constructor(
        private readonly conversationRepository: InMemoryConversationRepository,
        private readonly messageRepository: InMemoryMessageRepository,
        private readonly userRepository: InMemoryUserRepository,
        private readonly uuidService: CryptoUuidGenerator,
        private readonly notificationRepository: InMemoryNotificationRepository,
        private readonly notificationPublisher: NotificationService,
        private readonly io?: Server,
        private readonly clients?: ClientsSocket,
        private readonly onlineUsers?: Record<string, OnlineUser>,
    ){}

    async createConversation(req: Request, res: Response) {
        const createConversationUseCase = new CreateConversationUseCase(this.conversationRepository, this.uuidService);
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await createConversationUseCase.execute(userId);

        if(result instanceof Error) {
            return res.status(500).json({error: result.message});
        }
        if(result instanceof InvalidConversationError) {
            return res.status(400).json({error: result.message})
        }

        if(result instanceof InvalidUserIdError) {
            return res.status(400).json({error: result.message});
        }

        if (this.io && this.clients && this.onlineUsers) {
            Object.keys(this.clients).forEach((advisorId) => {
                if (this.onlineUsers![advisorId]?.role === "BANK_ADVISOR") {
                this.clients![advisorId]!.forEach((socketId) => {
                    this.io!.to(socketId).emit("pendingConversation", result);
                });
                }
            });
            }

            return res.status(201).json(result);
        }

    async sendMessage(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
                    this.notificationRepository,
                    this.notificationPublisher,
                    this.uuidService,
                    this.userRepository
                );
        const sendMessageUseCase = new SendMessageUseCase(this.conversationRepository, this.messageRepository, this.uuidService, sendNotificationUseCase);

        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const parseResult = sendMessageSchema.safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await sendMessageUseCase.execute(userId, role, parseResult.data.conversationId, parseResult.data.content)

        if(result instanceof Error) {
            if(result instanceof InvalidMessageError) {
                return res.status(400).json({error: result.message});
            }

            if(result instanceof AdvisorAlreadyAssignedError) {
                return res.status(409).json({error: result.message});
            }

            if(result instanceof NoAdvisorAssignedError) {
                return res.status(409).json({error: result.message});
            }

            
            if(result instanceof ConversationNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }

        return res.status(201).json(result);
    }

    async getPendingConversation(req: Request, res: Response) {
        const getAllPendingConversationUseCase = new GetPendingConversationUseCase(this.conversationRepository);
        const result = await getAllPendingConversationUseCase.execute();
        if(result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getAdvisorConversation(req: Request, res: Response) {
        const getAdvisorConversationUseCase = new GetAdvisorConversationUseCase(this.conversationRepository, this.userRepository);
        const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getAdvisorConversationUseCase.execute(userId);    
        if(result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }
        if(result instanceof UserNotFoundError) {
            return res.status(404).json({error: result.message});
        }
        return res.status(200).json(result);
    }

    async getClientConversation(req: Request, res: Response) {
        
        const getClientConversationUseCase = new GetClientConversationUseCase(this.conversationRepository, this.userRepository);
        
        const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getClientConversationUseCase.execute(userId);
        if(result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }
        if(result instanceof UserNotFoundError) {
            return res.status(404).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getConversationMessages(req: Request, res: Response) {
        const getConversationMessagesUseCase = new GetConversationMessagesUseCase(this.conversationRepository, this.messageRepository);

        const {conversationId} = req.params;
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        if(!conversationId) {
            return res.status(404).json({ error: "conversation not found" });
        }

        const result = await getConversationMessagesUseCase.execute(conversationId);
            
            if(result instanceof MessageNotFoundError) {
                return res.status(404).json({error: result.message});
            }

            if(result instanceof ConversationNotFoundError) {
                return res.status(404).json({error: result.message});
            }

            if(result instanceof Error) {
                return res.status(500).json({ error: result.message });
            }
        return res.status(200).json(result);
    }

    async markMessageAsRead(req: Request, res: Response) {

        const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(this.messageRepository);

        const {message} = req.body;
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await markMessageAsReadUseCase.execute(message); 

        if(result instanceof MessageNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if(result instanceof Error) {   
            return res.status(500).json({ error: result.message });
        }
        return res.status(200).json(result);
    }


    async transferConversation(req: Request, res: Response) {

    const transferUseCase = new TransferConversationUseCase(this.conversationRepository);
    const userId = req.user?.userId;
    const role = req.user?.roles?.[0];

    const parseResult = transferConversationSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.message });
    }

    if(!userId || !role) {
        return res.status(401).json({error: "Unauthorized access"});
    }

    const result = await transferUseCase.execute(parseResult.data.conversationId, parseResult.data.newAdvisorId);

    if (result instanceof Error) {
        if(result instanceof SameAdvisorError) {
            return res.status(409).json({ error: result.message });
        }

    return res.status(500).json({ error: result.message });
    }
    if(result instanceof ConversationNotFoundError) {
        return res.status(404).json({error: result.message});
    }

    return res.status(200).json(result);
    }
}