import { MessageEntity } from "../../../../domain/entities/MessageEntity.";
import { InvalidMessageError } from "../../../../domain/errors/InvalidMessageError";
import { MessageNotFoundError } from "../../../errors/chat/MessageNotFoundError";

export interface MessageRepositoryInterface {
    findByConversation(clientId: string): Promise<Array<MessageEntity>>;
    save(message: MessageEntity) : Promise<MessageEntity | InvalidMessageError>;
    updateMessage(message: MessageEntity): Promise<MessageEntity | MessageNotFoundError>
}