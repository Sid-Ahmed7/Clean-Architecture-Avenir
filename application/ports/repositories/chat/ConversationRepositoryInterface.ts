import { ConversationEntity } from "../../../../domain/entities/ConversationEntity";
import { AdvisorAlreadyAssignedError } from "../../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationNotFoundError } from "../../../errors/chat/ConversationNotFoundError";

export interface ConversationRepositoryInterface {

    findByClientId(clientId: string): Promise<ConversationEntity | null>
    save(conversation: ConversationEntity): Promise<void | AdvisorAlreadyAssignedError>
    update(conversation: ConversationEntity): Promise<void | ConversationNotFoundError>;
}