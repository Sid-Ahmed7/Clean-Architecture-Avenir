import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetConversationMessagesUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private messageRepository: MessageRepositoryInterface
         ) {}


         public async execute (conversationId: number) {

            const conversation = await this.conversationRepository.findByConversationId(conversationId);

            const messages = await this.messageRepository.findByConversationId(conversation?.id!);

            return {conversation, messages};
    }
}