import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import {ClientConversationResponse} from "../../responses/ClientConversationResponse";
export class GetClientConversationUseCase {

    public constructor(
        private readonly conversationRepository: ConversationRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface
         ) {}


         public async execute (clientId: string) {

            const conversations = await this.conversationRepository.findByClientId(clientId);
            if(conversations instanceof Error) {
                return [];
            }

         
        const result: ClientConversationResponse[] = await Promise.all(
            conversations.map(async (conversation) => {

                let advisorName: string | undefined;
                if (conversation.advisorId) {
                    const advisor = await this.userRepository.findById(conversation.advisorId);
                    if (!(advisor instanceof Error)) {
                        advisorName = `${advisor.firstName} ${advisor.lastName}`;
                    }
                }

                return {
                    id: conversation.id,
                    clientId: conversation.clientId,
                    advisorId: conversation.advisorId || null,
                    createdAt: conversation.createdAt,
                    advisorName,
                } as ClientConversationResponse;
            })
        );
        return result.filter((result) => result !== null) as ClientConversationResponse[];
            
        
    }
}