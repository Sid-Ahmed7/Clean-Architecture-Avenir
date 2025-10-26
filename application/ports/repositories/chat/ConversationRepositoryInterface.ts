import { ConversationEntity } from "../../../../domain/entities/ConversationEntity";
import { AdvisorAlreadyAssignedError } from "../../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationNotFoundError } from "../../../errors/chat/ConversationNotFoundError";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { InvalidConversationError} from "../../../../domain/errors/InvalidConversationError"
export interface ConversationRepositoryInterface {

    findByConversationId(conversationId: number): Promise<ConversationEntity | ConversationNotFoundError>
    findByAdvisorId(advisorId: string): Promise<Array<ConversationEntity> | UserNotFoundError >;
    findByClientId(clientId: string): Promise<Array<ConversationEntity> | UserNotFoundError>;
    findAll(): Promise<Array<ConversationEntity>>;
    save(conversation: ConversationEntity): Promise<void | InvalidConversationError>
    update(conversation: ConversationEntity): Promise<void | ConversationNotFoundError>;
}