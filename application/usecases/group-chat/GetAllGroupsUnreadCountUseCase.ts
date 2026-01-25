import { GroupMessageRepositoryInterface } from "../../ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { GroupUnreadCount } from "../../responses/GroupUnreadCount";


export class GetAllGroupsUnreadCountUseCase {
    constructor(
        private readonly groupMessageRepository: GroupMessageRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface
    ) {}

    public async execute(userId: string): Promise<GroupUnreadCount[]> {
        const userGroups = await this.groupParticipantRepository.findByUserId(userId);

        const unreadCounts: GroupUnreadCount[] = [];

        for (const participant of userGroups) {
            const count = await this.groupMessageRepository.getUnreadCount(participant.groupId, userId);
            unreadCounts.push({
                groupId: participant.groupId,
                unreadCount: count
            });
        }

        return unreadCounts;
    }
}