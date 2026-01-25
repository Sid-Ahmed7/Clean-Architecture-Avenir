import { GroupParticipantEntity } from "../../../domain/entities/GroupParticipantEntity";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";

export class GetGroupParticipantsUseCase {
    constructor(
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface
    ){}

    public async execute(groupId: string): Promise<Array<GroupParticipantEntity> | Error> {
        const participants = await this.groupParticipantRepository.findByGroupId(groupId);

        if(participants instanceof Error) {
            return participants;
        }
        return participants;
    }
}