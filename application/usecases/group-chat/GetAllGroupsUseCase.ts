import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { GroupWithParticipation } from "../../responses/GroupWithParticipation";


export class GetAllGroupsUseCase {
    constructor(
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface
    ) {}

    public async execute(userId: string): Promise<GroupWithParticipation[]> {
        const groups = await this.groupConversationRepository.findAll();
        const userParticipations = await this.groupParticipantRepository.findByUserId(userId);

        const participantGroupIds = new Set(userParticipations.map(p => p.groupId));

        return groups.map(group => ({
            id: group.id,
            name: group.name,
            createdBy: group.createdBy,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            isParticipant: participantGroupIds.has(group.id)
        }));
    }
}
