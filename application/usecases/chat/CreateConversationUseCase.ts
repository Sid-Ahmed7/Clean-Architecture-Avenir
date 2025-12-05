import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import {UuidGeneratorService} from "../../ports/services/UuidGeneratorService"
export class CreateConversationUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private uuidService: UuidGeneratorService
         ) {}

    public async execute(clientId: string) {

        const id = this.uuidService.generate();
        const conversation = ConversationEntity.from(id, clientId, "", new Date());
        
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