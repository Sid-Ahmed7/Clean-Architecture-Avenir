import { InvalidGroupConversationError } from '../errors/InvalidGroupConversationError';
import { GroupConversationIdValue } from '../values/GroupConversationIdValue';
import { GroupNameValue } from '../values/GroupNameValue';
import { UserIdValue } from '../values/UserIdValue';

export class GroupConversationEntity {
    public static from(id: string, name: string, createdBy: string, createdAt: Date, updatedAt: Date): GroupConversationEntity | InvalidGroupConversationError {
        const groupConversationId = GroupConversationIdValue.from(id);
        if (groupConversationId instanceof Error) {
            return new InvalidGroupConversationError(groupConversationId.message);
        }

        const groupName = GroupNameValue.from(name);
        if (groupName instanceof Error) {
            return new InvalidGroupConversationError(groupName.message);
        }

        const createdByUser = UserIdValue.from(createdBy);
        if (createdByUser instanceof Error) {
            return new InvalidGroupConversationError(createdByUser.message);
        }

        return new GroupConversationEntity(groupConversationId.value, groupName.value, createdByUser.value, createdAt, updatedAt);
    }

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly createdBy: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}