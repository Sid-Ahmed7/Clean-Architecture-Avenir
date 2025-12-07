import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetPendingConversationUseCase {

    public constructor(
        private readonly conversationRepository: ConversationRepositoryInterface,
         ) {}


         public async execute (): Promise<Array<ConversationEntity>> {

            const conversations = await this.conversationRepository.findAll();
            const pendingConversation = conversations.filter((conversation) => !conversation.advisorId || conversation.advisorId === "");
    
            return pendingConversation;
        }
}