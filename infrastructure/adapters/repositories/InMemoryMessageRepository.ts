import { ConversationNotFoundError } from "../../../application/errors/chat/ConversationNotFoundError";
import { MessageNotFoundError } from "../../../application/errors/chat/MessageNotFoundError";
import { MessageRepositoryInterface } from "../../../application/ports/repositories/chat/MessageRepositoryInterface";
import { MessageEntity } from "../../../domain/entities/MessageEntity";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { InvalidMessageError } from "../../../domain/errors/InvalidMessageError";

export class InMemoryMessageRepository implements MessageRepositoryInterface {

    
    private messages: Array<MessageEntity>;
    private incrId;

    public constructor() {
        this.messages = [];
        this.incrId = 0;

    }

  public async findById(id: number) {
        const msg = this.messages.find(m => m.id === id);
        if (!msg) return new MessageNotFoundError("Message not found");
        return msg;
    }
  
    public async findUnreadByRecipient(userId: string) : Promise<Array<MessageEntity>> {
        return this.messages.filter((message) => message.authorId !== userId && message.readStatus === ReadStatusEnum.UNREAD)
    }
    public async findByConversationId(conversationId: number): Promise<MessageEntity[] | ConversationNotFoundError> {
    const messageConversation =  this.messages.filter((message) => message.conversationId === conversationId);

    if(!messageConversation) {
        return new ConversationNotFoundError(`Conversation with id ${conversationId} not found`)
    }

    return messageConversation;
}

    public async save(message: MessageEntity): Promise<MessageEntity | InvalidMessageError> {
        if(!message.authorId) {
            return new InvalidMessageError("Message must have an author");
        }
        this.incrId++;
        message.id = this.incrId;

        this.messages.push(message);
        return message;
    }

    public async updateMessage(message: MessageEntity): Promise<MessageEntity | MessageNotFoundError> {
        const index = this.messages.findIndex((msg) => msg.conversationClientId === message.conversationClientId && msg.authorId === message.authorId);
        if(index === -1) {
            return new MessageNotFoundError("Message not found for this conversation and author");
        }
        this.messages[index] = message;
        return message;
    }
}