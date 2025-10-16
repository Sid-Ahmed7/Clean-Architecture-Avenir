import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { MessageEntity } from "../../../domain/entities/MessageEntity.";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { AdvisorAlreadyAssignedError } from "../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class SendMessageUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private messageRepository: MessageRepositoryInterface
         ) {}


    public async execute(userId: string, role:string, clientId: string, content: string) {

        const isAdvisor = role === "BANK_ADVISOR";
        const isClient = role === "CLIENT";

        const existingConversation = await this.conversationRepository.findByClientId(clientId);
        if(existingConversation instanceof Error) {
            return existingConversation;
        }

        const conversation = existingConversation ?? ConversationEntity.from(clientId, "", new Date());
        
        if(conversation instanceof Error) {
            return conversation;
        }

        if(!existingConversation) {
            const createConversation = await this.conversationRepository.save(conversation);
            
            if (createConversation instanceof Error) {
                return createConversation;
            }
        }

        if(isAdvisor && !conversation.advisorId) {
            conversation.assignAdvisor(userId);
            const updateConversation = await this.conversationRepository.update(conversation);
            if(updateConversation instanceof Error) {
                return updateConversation;
            }
        }

        if(isAdvisor && conversation.advisorId !== userId) {
            return new AdvisorAlreadyAssignedError();
        }

        const message = MessageEntity.from(clientId, conversation.advisorId, userId, content, ReadStatusEnum.UNREAD, new Date())
        if(message instanceof Error) {
            return message;
        }

        const addMessage = await this.messageRepository.save(message);
        if(addMessage instanceof Error) {
            return message;
        }

        return addMessage;
    }
}