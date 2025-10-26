import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { SameAdvisorError } from "../../errors/chat/SameAdvisorErrror";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";

export class TransferConversationUseCase {

    public constructor(private conversationRepository: ConversationRepositoryInterface){}

    public async execute(conversationId: number, newAdvisorId: string) {
        const conversation = await this.conversationRepository.findByConversationId(conversationId);

        if(conversation instanceof Error) {
            return conversation;
        }

        if(conversation.advisorId === newAdvisorId) {
            return new SameAdvisorError();
        }

        conversation.assignAdvisor(newAdvisorId);

        const updated = await this.conversationRepository.update(conversation);
        if(updated instanceof Error) {
            return updated;
        }

        return conversation;
    }
}