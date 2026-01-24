import { Request, Response } from "express";

import { CreateGroupConversationUseCase } from "../../../../../application/usecases/group-chat/CreateGroupConversationUseCase";
import { JoinGroupConversationUseCase } from "../../../../../application/usecases/group-chat/JoinGroupConversationUseCase";
import { SendGroupMessageUseCase } from "../../../../../application/usecases/group-chat/SendGroupMessageUseCase";
import { GetGroupMessagesUseCase } from "../../../../../application/usecases/group-chat/GetGroupMessagesUseCase";
import { GetGroupParticipantsUseCase } from "../../../../../application/usecases/group-chat/GetGroupParticipantsUseCase";
import { GetAllGroupsUseCase } from "../../../../../application/usecases/group-chat/GetAllGroupsUseCase";
import { UserRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { GroupConversationRepositoryInterface } from "../../../../../application/ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupMessageRepositoryInterface } from "../../../../../application/ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../../../../application/ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { createGroupSchema } from "../schemas/group-chat/createGroupSchema";
import { UnauthorizedGroupCreationError } from "../../../../../application/errors/UnauthorizedGroupCreationError";
import { GroupConversationNotFoundError } from "#application/errors/GroupConversationNotFoundError";
import { UserAlreadyInGroupError } from "#application/errors/UserAlreadyInGroupError";
import { sendGroupMessageSchema } from "../schemas/group-chat/sendGroupMessageSchema";
import { NotAGroupParticipantError } from "#application/errors/NotAGroupParticipantError";

export class GroupChatController {

constructor (
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
        private readonly groupMessageRepository: GroupMessageRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly uuidService: CryptoUuidGenerator
){}

async createGroup(req: Request, res: Response) {

    const parseResult = createGroupSchema.safeParse(req.body);
    if(!parseResult.success) {
        return res.status(400).json({ error: parseResult.error });
    }
    const { name } = parseResult.data;
    const userId = req.user?.userId;
    const roles = req.user?.roles ?? [];

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }    
    
    const createGroupConversationUseCase = new CreateGroupConversationUseCase(this.groupConversationRepository,this.uuidService);

    const result = await createGroupConversationUseCase.execute(name, userId, roles[0]);

    if (result instanceof Error) {
         if (result instanceof UnauthorizedGroupCreationError) {
            return res.status(403).json({ error: result.message });
        }
        return res.status(400).json({ error: result.message });
    }

    return res.status(201).json(result);
} 



async joinGroup(req: Request, res: Response) {
    const groupId = req.params.groupId as string;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const roles = req.user?.roles ?? [];

    const joinGroupConversationUseCase = new JoinGroupConversationUseCase(this.groupConversationRepository,this.groupParticipantRepository,this.uuidService);

    const result = await joinGroupConversationUseCase.execute(groupId, userId, roles[0]);

    if (result instanceof Error) {
            if (result instanceof GroupConversationNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof UserAlreadyInGroupError) {
                return res.status(409).json({ error: result.message });
            }
        return res.status(400).json({ error: result.message });
    }
    return res.status(200).json(result);
    }

    async sendMessage(req: Request, res: Response) {
        const groupId = req.params.groupId as string;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const roles = req.user?.roles ?? [];
        const parseResult = sendGroupMessageSchema.safeParse(req.body);
        if(!parseResult.success) {
            return res.status(400).json({ error: parseResult.error });
        }
        const { content } = parseResult.data;

        const sendGroupMessageUseCase = new SendGroupMessageUseCase(this.groupMessageRepository, this.groupConversationRepository,this.groupParticipantRepository, this.userRepository, this.uuidService);
        const result = await sendGroupMessageUseCase.execute(groupId, userId,  roles[0], content);

        if (result instanceof Error) {
            
        if (result instanceof NotAGroupParticipantError) {
            return res.status(403).json({ error: result.message });
        }
            return res.status(400).json({ error: result.message });
        }
        return res.status(201).json(result);
    }

    async getMessages (req: Request, res: Response) {
        const groupId = req.params.groupId as string;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const getGroupMessagesUseCase = new GetGroupMessagesUseCase(this.groupParticipantRepository, this.groupMessageRepository);
        const result = await getGroupMessagesUseCase.execute( groupId, userId, limit, offset);
        if (result instanceof Error) {
            
        if (result instanceof NotAGroupParticipantError) {
            return res.status(403).json({ error: result.message });
        }
            return res.status(400).json({ error: result.message });
        }
        return res.status(200).json(result);
    }

    async getParticipants (req: Request, res: Response) {
        const groupId = req.params.groupId as string;
        const getGroupParticipantsUseCase = new GetGroupParticipantsUseCase(this.groupParticipantRepository);
        const result = await getGroupParticipantsUseCase.execute(groupId);
        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }
        return res.status(200).json(result);
    }

    async getAllGroups(req: Request, res: Response) {
        const getAllGroupsUseCase = new GetAllGroupsUseCase(this.groupConversationRepository);
        const result = await getAllGroupsUseCase.execute();
        return res.status(200).json(result);
    }
}
