import { Request, Response } from "express";
import { InMemoryConversationRepository } from "../../../../adapters/repositories/InMemoryConversationRepository";
import { InMemoryMessageRepository } from "../../../../adapters/repositories/InMemoryMessageRepository";
import { CreateConversationUseCase } from "../../../../../application/usecases/chat/CreateConversationUseCase";
import { SendMessageUseCase } from "../../../../../application/usecases/chat/SendMessageUseCase";
import { GetConversationMessagesUseCase } from "../../../../../application/usecases/chat/GetConversationMessagesUseCase";
import { MarkMessageAsReadUseCase } from "../../../../../application/usecases/chat/MarkMessageAsReadUseCase";
import { TransferConversationUseCase } from "../../../../../application/usecases/chat/TransferConversationUseCase";
import { GetPendingConversationUseCase } from "../../../../../application/usecases/chat/GetPendingConversationUseCase";
import { InvalidMessageError } from "../../../../../domain/errors/InvalidMessageError";
import { AdvisorAlreadyAssignedError } from "../../../../../application/errors/chat/AdvisorAlreadyAssignedError";
import { MessageNotFoundError } from "../../../../../application/errors/chat/MessageNotFoundError";
import { SameAdvisorError } from "../../../../../application/errors/chat/SameAdvisorErrror";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";

export class ChatController {


    constructor(
        private readonly conversationRepository: InMemoryConversationRepository,
        private readonly messageRepository: InMemoryMessageRepository
    ){}

    async createConversation(req: Request, res: Response) {
        const createConversationUseCase = new CreateConversationUseCase(this.conversationRepository);
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await createConversationUseCase.execute(userId);

        if(result instanceof Error) {

            return res.status(500).json({error: result.message});
        }
        if(result instanceof InvalidUserIdError) {
            return res.status(400).json({error: result.message});
        }

        if(result instanceof AdvisorAlreadyAssignedError) {
            return res.status(409).json({error: result.message});
        }
        
        return res.status(201).json(result);
    }

    async sendMessage(req: Request, res: Response) {
        const sendMessageUseCase = new SendMessageUseCase(this.conversationRepository, this.messageRepository);

        const {conversationId, content} = req.body;
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await sendMessageUseCase.execute(userId, role, conversationId, content)

        if(result instanceof Error) {
            if(result instanceof InvalidMessageError) {
                return res.status(400).json({error: result.message});
            }

            if(result instanceof AdvisorAlreadyAssignedError) {
                return res.status(409).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(201).json(result);
    }

    async getPendingConversation(req: Request, res: Response) {
        const getAllPendingConversationUseCase = new GetPendingConversationUseCase(this.conversationRepository);
        const result = getAllPendingConversationUseCase.execute();
        if(result instanceof Error) {
            return res.status(500).json({ error: result.message });
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

        const result = await getConversationMessagesUseCase.execute(Number(conversationId));
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
        const {conversation, newAdvisorId} = req.body;
        const userId = req.user?.userId;
        const role = req.user?.roles?.[0];

        if(!userId || !role) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await transferUseCase.execute(conversation,newAdvisorId);

        if (result instanceof Error) {
            if(result instanceof SameAdvisorError) {
                return res.status(409).json({ error: result.message });
            }
           return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
}







}