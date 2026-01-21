import { GroupParticipantEntity } from "../../../domain/entities/GroupParticipantEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserAlreadyInGroupError } from "../../errors/UserAlreadyInGroupError";
import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";


export class JoinGroupConversationUseCase{

    constructor(
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
        private readonly uuidGenerator: UuidGeneratorService
    ){}

    public async execute(groupId: string, userId: string, role: RoleEnum): Promise<GroupParticipantEntity | Error> {

        const groupConversation = await this.groupConversationRepository.findById(groupId);
        
        if(groupConversation instanceof Error) {
            return groupConversation;
        }

        const isAlreadyParticipant = await this.groupParticipantRepository.isParticipant(groupId, userId);
        
        if(isAlreadyParticipant) {
            return new UserAlreadyInGroupError("User is already a participant of the group conversation.");
        }

        const participantId = this.uuidGenerator.generate();
        const participant = GroupParticipantEntity.from(
            participantId,
            groupId,
            userId,
            role,
            new Date()
        )

        if(participant instanceof Error) {
            return participant;
        }
        const savedParticipant = await this.groupParticipantRepository.addParticipant(participant);
        if(savedParticipant instanceof Error) {
            return savedParticipant;
        }
        return savedParticipant;
    }
}