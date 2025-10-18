import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { MessageEntity } from "../../../domain/entities/MessageEntity.";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { AdvisorAlreadyAssignedError } from "../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class CreateConversationUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
         ) {}


    public async execute(clientId: string) {

        const generatedId = Math.floor(Math.random() * 1000000) + 1;

        const conversation = ConversationEntity.from(generatedId,clientId, "",new Date());
        if(conversation instanceof Error) {
            return conversation;
        }
        const createdConversation = await this.conversationRepository.save(conversation);
        
        if(createdConversation instanceof Error) {
            return createdConversation;
        }

        return conversation;
    }
}