import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetConversationMessagesUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private messageRepository: MessageRepositoryInterface
         ) {}


         public async execute (conversationId: number) {

            const conversation = await this.conversationRepository.findByConversationId(conversationId);
            if( conversation instanceof Error) {
                return conversation;
            }

            const messages = await this.messageRepository.findByConversationId(conversationId);

            if(messages instanceof Error) {
                return messages;
            }
            const clientMessages = messages.filter((msg) => msg.authorId === conversation.clientId);
            const advisorsMessages = messages.filter((msg) => msg.authorId === conversation.advisorId);
            return {conversation, 
                    messages: {
                        client: clientMessages,
                        advisor: advisorsMessages
                    }};
    }
}