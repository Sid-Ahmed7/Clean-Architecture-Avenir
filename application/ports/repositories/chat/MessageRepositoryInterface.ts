import { MessageEntity } from "../../../../domain/entities/MessageEntity";
import { InvalidMessageError } from "../../../../domain/errors/InvalidMessageError";
import { ConversationNotFoundError } from "../../../errors/chat/ConversationNotFoundError";
import { MessageNotFoundError } from "../../../errors/chat/MessageNotFoundError";

export interface MessageRepositoryInterface {
    findById(id: string): Promise<MessageEntity | MessageNotFoundError>;
    findUnreadByRecipient(userId: string): Promise<Array<MessageEntity>>;
    findByConversationId(id: string): Promise<Array<MessageEntity> | ConversationNotFoundError>;
    save(message: MessageEntity) : Promise<MessageEntity | InvalidMessageError>;
    updateMessage(message: MessageEntity): Promise<MessageEntity | MessageNotFoundError>
}