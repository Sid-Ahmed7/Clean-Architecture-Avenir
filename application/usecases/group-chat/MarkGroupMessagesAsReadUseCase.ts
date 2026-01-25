import { NotAGroupParticipantError } from '../../errors/NotAGroupParticipantError';
import { GroupMessageRepositoryInterface } from '../../ports/repositories/group-chat/GroupMessageRepositoryInterface';
import { GroupParticipantRepositoryInterface } from '../../ports/repositories/group-chat/GroupParticipantRepositoryInterface';

export class MarkGroupMessagesAsReadUseCase {
    constructor(
        private readonly groupMessageRepository: GroupMessageRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface
    ) {}

    public async execute(groupId: string, userId: string): Promise<void | NotAGroupParticipantError> {
        const isParticipant = await this.groupParticipantRepository.isParticipant(groupId, userId);

        if (!isParticipant) {
            return new NotAGroupParticipantError("User is not a participant of the group.");
        }

        await this.groupMessageRepository.markAllMessagesAsRead(groupId, userId);
    }
}
