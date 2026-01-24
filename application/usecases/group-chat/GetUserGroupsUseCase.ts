import { GroupParticipantEntity } from "../../../domain/entities/GroupParticipantEntity";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";

export class GetUserGroupsUseCase {
    constructor(
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface
    ) {}

    public async execute(userId: string): Promise<GroupParticipantEntity[]> {
        return await this.groupParticipantRepository.findByUserId(userId);
    }
}
