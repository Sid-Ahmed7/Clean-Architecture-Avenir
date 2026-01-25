import { RoleEnum } from "../enums/RoleEnum";
import { GroupParticipantIdValue } from "../values/GroupParticipantIdValue";
import { GroupConversationIdValue } from "../values/GroupConversationIdValue";
import { UserIdValue } from "../values/UserIdValue";
import { InvalidGroupParticipantError } from "../errors/InvalidGroupParticipantError";

export class GroupParticipantEntity {
    public static from(id: string, groupId: string, userId: string, role: RoleEnum, joinedAt: Date): GroupParticipantEntity | InvalidGroupParticipantError {
        const participantId = GroupParticipantIdValue.from(id);
        if (participantId instanceof Error) {
            return new InvalidGroupParticipantError(participantId.message);
        }

        const groupConversationId = GroupConversationIdValue.from(groupId);
        if (groupConversationId instanceof Error) {
            return new InvalidGroupParticipantError(groupConversationId.message);
        }

        const userIdValue = UserIdValue.from(userId);
        if (userIdValue instanceof Error) {
            return new InvalidGroupParticipantError(userIdValue.message);
        }

        if (role !== RoleEnum.BANK_ADVISOR && role !== RoleEnum.BANK_MANAGER) {
            return new InvalidGroupParticipantError("Only advisors and managers can join group chat");
        }

        return new GroupParticipantEntity(participantId.value, groupConversationId.value, userIdValue.value, role, joinedAt);
    }

    private constructor(
        public readonly id: string,
        public readonly groupId: string,
        public readonly userId: string,
        public readonly role: RoleEnum,
        public readonly joinedAt: Date
    ) {}

    public isManager(): boolean {
        return this.role === RoleEnum.BANK_MANAGER;
    }
}