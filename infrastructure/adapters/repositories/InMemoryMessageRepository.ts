import { MessageNotFoundError } from "../../../application/errors/chat/MessageNotFoundError";
import { MessageRepositoryInterface } from "../../../application/ports/repositories/chat/MessageRepositoryInterface";
import { MessageEntity } from "../../../domain/entities/MessageEntity.";
import { InvalidMessageError } from "../../../domain/errors/InvalidMessageError";

export class InMemoryMessageRepository implements MessageRepositoryInterface {

    
    private messages: Array<MessageEntity>;

    public constructor() {
        this.messages = [];
    }


  public async findByConversation(conversationId: number): Promise<MessageEntity[]> {
    return this.messages.filter((message) => message.conversationId === conversationId);
}


    public async save(message: MessageEntity): Promise<MessageEntity | InvalidMessageError> {
        if(!message.authorId) {
            return new InvalidMessageError("Message must have an author");
        }
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