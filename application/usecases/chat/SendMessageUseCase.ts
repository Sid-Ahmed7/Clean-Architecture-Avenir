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


    public async execute(userId: string, role:string, conversationId: number, content: string) {

        const isAdvisor = role === "BANK_ADVISOR";

        const existingConversation = await this.conversationRepository.findByConversationId(conversationId);
        if(!(existingConversation instanceof Error)) {
            return existingConversation;
        }



        if(isAdvisor && !existingConversation.advisorId) {
            existingConversation.assignAdvisor(userId);
            const updateConversation = await this.conversationRepository.update(existingConversation);
            if(updateConversation instanceof Error) {
                return updateConversation;
            }
        }

        if(isAdvisor && existingConversation.advisorId !== userId) {
            return new AdvisorAlreadyAssignedError();
        }
        const generatedId = Math.floor(Math.random() * 1000000) + 1;

        const message = MessageEntity.from(generatedId,existingConversation.id, existingConversation.clientId, existingConversation.advisorId, userId,  content, ReadStatusEnum.UNREAD, new Date())
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