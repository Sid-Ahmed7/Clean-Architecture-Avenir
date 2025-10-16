import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { SameAdvisorError } from "../../errors/chat/SameAdvisorErrror";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";

export class TransferConversationUseCase {

    public constructor(private conversationRepository: ConversationRepositoryInterface){}

    public async execute(conversation: ConversationEntity, newAdvisorId: string) {
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