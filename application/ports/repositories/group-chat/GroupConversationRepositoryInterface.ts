import {GroupConversationEntity} from "../../../../domain/entities/GroupConversationEntity";
import { GroupConversationNotFoundError } from "../../../errors/GroupConversationNotFoundError";

export interface GroupConversationRepositoryInterface {
    create(group: GroupConversationEntity): Promise<GroupConversationEntity>;
    findById(id: string): Promise<GroupConversationEntity | GroupConversationNotFoundError>;
    findAll(): Promise<GroupConversationEntity[]>;
    update(group: GroupConversationEntity): Promise<GroupConversationEntity>;
    delete(id: string): Promise<void>;
}