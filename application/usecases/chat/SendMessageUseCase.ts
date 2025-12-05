import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { MessageEntity } from "../../../domain/entities/MessageEntity";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { InvalidMessageError } from "../../../domain/errors/InvalidMessageError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";
import { AdvisorAlreadyAssignedError } from "../../errors/chat/AdvisorAlreadyAssignedError";
import { NoAdvisorAssignedError } from "../../errors/chat/NoAdvisorAssignedError";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";
import {UuidGeneratorService} from "../../ports/services/UuidGeneratorService"

export class SendMessageUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private messageRepository: MessageRepositoryInterface,
        private uuidService: UuidGeneratorService
         ) {}


    public async execute(userId: string, role:string, conversationId: string, content: string) {

        const isAdvisor = role === "BANK_ADVISOR";

        const existingConversation = await this.conversationRepository.findByConversationId(conversationId);

        if (existingConversation instanceof Error) {
            return existingConversation;
        }

        if(isAdvisor) {
            
           if(!existingConversation.advisorId || existingConversation.advisorId === "") {
               return new NoAdvisorAssignedError("No assigned advisor");
            }

           if(existingConversation.advisorId !== userId) {
                return new AdvisorAlreadyAssignedError("This advisor is already assigned to this conversation");
            }

        }   
                const id = this.uuidService.generate();

        const message = MessageEntity.from(id ,existingConversation.id, existingConversation.clientId, existingConversation.advisorId || "", userId,  content, ReadStatusEnum.UNREAD, new Date())
        
        if(message instanceof InvalidMessageError || message instanceof InvalidUserIdError) {
            return message;
        }

        const addMessage = await this.messageRepository.save(message);
        if(addMessage instanceof Error) {
            return addMessage;
        }

return addMessage;
    }
}