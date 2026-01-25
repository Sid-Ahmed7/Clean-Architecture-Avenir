import { RoleEnum } from '../enums/RoleEnum';
import { InvalidMessageError } from '../errors/InvalidMessageError';
import { GroupMessageIdValue } from '../values/GroupMessageIdValue';
import { GroupConversationIdValue } from '../values/GroupConversationIdValue';
import { UserIdValue } from '../values/UserIdValue';
import { GroupMessageContentValue } from '../values/GroupMessageContentValue';

export class GroupMessageEntity {
    public static from(id: string, groupId: string, senderId: string, senderRole: RoleEnum, senderFirstName: string, senderLastName: string, content: string, createdAt: Date, readBy: string[]): GroupMessageEntity | InvalidMessageError {
        const messageId = GroupMessageIdValue.from(id);
        if (messageId instanceof Error) {
            return new InvalidMessageError(messageId.message);
        }

        const groupConversationId = GroupConversationIdValue.from(groupId);
        if (groupConversationId instanceof Error) {
            return new InvalidMessageError(groupConversationId.message);
        }

        const senderIdValue = UserIdValue.from(senderId);
        if (senderIdValue instanceof Error) {
            return new InvalidMessageError(senderIdValue.message);
        }

        const contentValue = GroupMessageContentValue.from(content);
        if (contentValue instanceof Error) {
            return new InvalidMessageError(contentValue.message);
        }

        return new GroupMessageEntity(
            messageId.value,
            groupConversationId.value,
            senderIdValue.value,
            senderRole,
            senderFirstName,
            senderLastName,
            contentValue.value,
            createdAt,
            readBy
        );
    }

    private constructor(
        public readonly id: string,
        public readonly groupId: string,
        public readonly senderId: string,
        public readonly senderRole: RoleEnum,
        public readonly senderFirstName: string,
        public readonly senderLastName: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly readBy: string[]
    ) {}

      
    public isSentByManager(): boolean {
        return this.senderRole === RoleEnum.BANK_MANAGER;
    }

    public markAsReadBy(userId: string): GroupMessageEntity {
        if (this.readBy.includes(userId)) {
            return this;
        }
        return new GroupMessageEntity(
            this.id,
            this.groupId,
            this.senderId,
            this.senderRole,
            this.senderFirstName,
            this.senderLastName,
            this.content,
            this.createdAt,
            [...this.readBy, userId]
        );
    }
}