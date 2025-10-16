import { AdvisorAlreadyAssignedError } from "../../../application/errors/chat/AdvisorAlreadyAssignedError";
import { ConversationNotFoundError } from "../../../application/errors/chat/ConversationNotFoundError";
import { ConversationRepositoryInterface } from "../../../application/ports/repositories/chat/ConversationRepositoryInterface";
import { ConversationEntity } from "../../../domain/entities/ConversationEntity";


export class InMemoryConversationRepository implements ConversationRepositoryInterface {

    
    private conversations: Array<ConversationEntity>;

    public constructor() {
        this.conversations = [];
    }

    public async findByClientId(clientId: string): Promise<ConversationEntity | null> {
        const conversation = this.conversations.find((c) => c.clientId === clientId);
        return conversation ?? null;
    }

    public async save(conversation: ConversationEntity): Promise<void | AdvisorAlreadyAssignedError> {
        const exists = this.conversations.find((c) => c.clientId === conversation.clientId && c.advisorId === conversation.advisorId);
        if(exists) {
      return new AdvisorAlreadyAssignedError("This advisor is already assigned to this conversation")
        }
        this.conversations.push(conversation);
    }
    public async update(conversation: ConversationEntity): Promise<void | ConversationNotFoundError> {
       const index = this.conversations.findIndex((c) => c.clientId === conversation.clientId) 
        if(index === -1) {
           return new ConversationNotFoundError("Conversation not found for this client")
        }
        this.conversations[index] = conversation;    
    }
}