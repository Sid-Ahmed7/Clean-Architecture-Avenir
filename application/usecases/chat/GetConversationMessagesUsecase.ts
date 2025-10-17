import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetConversationMessagesUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private messageRepository: MessageRepositoryInterface
         ) {}


         public async execute (clientId: string) {

            const conversation = await this.conversationRepository.findByClientId(clientId);

            const messages = await this.messageRepository.findByConversation(clientId);

            return {conversation, messages};
    }
}