import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import {GroupParticipantWithUser} from "../../responses/GroupParticipantWithUser";


export class GetGroupParticipantsUseCase {
    constructor(
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
        private readonly userRepository?: UserRepositoryInterface
    ){}

    public async execute(groupId: string): Promise<Array<GroupParticipantWithUser> | Error> {
        const participants = await this.groupParticipantRepository.findByGroupId(groupId);

        if(participants instanceof Error) {
            return participants;
        }

        const participantsWithUser: GroupParticipantWithUser[] = [];

        for (const participant of participants) {
            let firstName = '';
            let lastName = '';

            if (this.userRepository) {
                const user = await this.userRepository.findById(participant.userId);
                if (!(user instanceof Error)) {
                    firstName = user.firstName;
                    lastName = user.lastName;
                }
            }

            participantsWithUser.push({
                id: participant.id,
                groupId: participant.groupId,
                userId: participant.userId,
                role: participant.role,
                joinedAt: participant.joinedAt,
                firstName,
                lastName
            });
        }

        return participantsWithUser;
    }
}