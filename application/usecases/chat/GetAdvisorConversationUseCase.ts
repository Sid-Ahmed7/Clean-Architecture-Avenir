import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetAdvisorConversationUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
         ) {}


         public async execute (advisorId: string) {

            const conversation = await this.conversationRepository.findByAdvisorId(advisorId);

            return conversation;
    }
}