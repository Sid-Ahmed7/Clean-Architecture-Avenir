import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";
import {ClientConversationDTO} from "./dto/ClientConversationDTO";
export class GetClientConversationUseCase {

    public constructor(
        private conversationRepository: ConversationRepositoryInterface,
        private userRepository: UserRepositoryInterface
         ) {}


         public async execute (clientId: string) {

            const conversations = await this.conversationRepository.findByClientId(clientId);
            if(conversations instanceof Error) {
                return [];
            }

         
        const result: ClientConversationDTO[] = await Promise.all(
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
                } as ClientConversationDTO;
            })
        );
        return result.filter((result) => result !== null) as ClientConversationDTO[];
            
        
    }
}