import { ConversationNotFoundError } from "../../../application/errors/chat/ConversationNotFoundError";
import { UserNotFoundError } from "../../../application/errors/UserNotFoundError";
import { ConversationRepositoryInterface } from "../../../application/ports/repositories/chat/ConversationRepositoryInterface";
import { ConversationEntity } from "../../../domain/entities/ConversationEntity";
import { InvalidConversationError } from "../../../domain/errors/InvalidConversationError";


export class InMemoryConversationRepository implements ConversationRepositoryInterface {

    
    private conversations: Array<ConversationEntity>;

    public constructor() {
        this.conversations = [];
    }
    public async findByConversationId(conversationId: string): Promise<ConversationEntity | ConversationNotFoundError> {
        const conversation = this.conversations.find((c) => c.id === conversationId);

        if(!conversation) {
            return new ConversationNotFoundError(`Conversation with id ${conversationId} not found`);
        }

        return conversation;
    }

    public async findByAdvisorId(advisorId: string): Promise<Array<ConversationEntity> | UserNotFoundError> {
        const conversation = this.conversations
            .filter(c => c.advisorId === advisorId)
            .filter((c, index, self) => index === self.findIndex(conv => conv.id === c.id));

        return conversation;
    }

    public async findByClientId(clientId: string): Promise<Array<ConversationEntity> | UserNotFoundError> {
        const conversation = this.conversations.filter((c) => c.clientId === clientId);
        return conversation;   
    }

    public async findAll(): Promise<Array<ConversationEntity>> {
        return this.conversations;
    }

    public async save(conversation: ConversationEntity): Promise<void | InvalidConversationError> {
        if (!conversation.clientId) {
            return new InvalidConversationError("Conversation must have a clientId");
        }

        const exists = this.conversations.find((c) => c.clientId === conversation.clientId && c.advisorId === conversation.advisorId);
        if (exists) {
            return new InvalidConversationError("This advisor is already assigned to this conversation");
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