import { GroupMessageEntity } from "../../../domain/entities/GroupMessageEntity";
import { NotAGroupParticipantError } from "../../errors/NotAGroupParticipantError";
import { GroupMessageRepositoryInterface } from "../../ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";

export class GetGroupMessagesUseCase {
    constructor(
        private readonly groupPartcipantRepository: GroupParticipantRepositoryInterface,
        private readonly groupMessageRepository: GroupMessageRepositoryInterface
    ){}

    public async execute(groupId: string, userId: string, limit: number = 50, offset: number = 0): Promise<Array<GroupMessageEntity> | Error> {
        const isParticipant = await this.groupPartcipantRepository.isParticipant(groupId, userId);

        if(!isParticipant) {
            return new NotAGroupParticipantError("User is not a participant of the group conversation.");
        }

        const messages = await this.groupMessageRepository.findByGroupId(groupId, limit,offset);

        if(messages instanceof Error) {
            return messages;
        }
        return messages;
        
    }



}