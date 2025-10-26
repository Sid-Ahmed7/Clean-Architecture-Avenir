import { AdvisorAlreadyAssignedError } from "../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationNotFoundError } from "../../errors/chat/ConversationNotFoundError";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";

export class AssignAdvisorToConversationUseCase {
    public constructor(
        private conversationRepository: ConversationRepositoryInterface
    ){}


    public async execute(conversationId: number, advisorId: string) {
        const conversation = await this.conversationRepository.findByConversationId(conversationId);

        if(conversation instanceof Error) {
            return conversation;
        }

          if(conversation?.advisorId && conversation.advisorId !== "" && conversation.advisorId !== advisorId) {
            return new AdvisorAlreadyAssignedError();
        }

        if(conversation?.advisorId === advisorId) {
            return conversation;
        }

        conversation?.assignAdvisor(advisorId);
        const result = await this.conversationRepository.update(conversation);
        
        if(result instanceof Error) {
            return result;
        }

        return result;


        }

      
    }
