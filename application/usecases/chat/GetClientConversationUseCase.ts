import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetClientConversationUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
         ) {}


         public async execute (clientId: string) {

            const conversation = await this.conversationRepository.findByClientId(clientId);

            return conversation;
    }
}