import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";
import { AdvisorConversationResponse} from "../../responses/AdvisorConversationResponse";
export class GetAdvisorConversationUseCase {

    public constructor(
        private readonly conversationRepository: ConversationRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface
         ) {}


         public async execute (advisorId: string) {

            const conversations = await this.conversationRepository.findByAdvisorId(advisorId);
            if(conversations instanceof Error) {
                return [];
            }

         
        const result: AdvisorConversationResponse[] = await Promise.all(
            conversations.map(async (conversation) => {

                let clientName: string | undefined;
                if (conversation.clientId) {
                        const client = await this.userRepository.findById(conversation.clientId);
                        if (!(client instanceof Error)) {
                            clientName = `${client.firstName} ${client.lastName}`;
                        }
                        }

                return {
                    id: conversation.id,
                    clientId: conversation.clientId,
                    advisorId: conversation.advisorId || null,
                    createdAt: conversation.createdAt,
                    clientName,
                } as AdvisorConversationResponse;
            })
        );
        return result.filter((result) => result !== null) as AdvisorConversationResponse[];
            
        
    }
}