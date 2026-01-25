import { GroupConversationEntity } from "../../../domain/entities/GroupConversationEntity";
import { GroupParticipantEntity } from "../../../domain/entities/GroupParticipantEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UnauthorizedGroupCreationError } from "../../errors/UnauthorizedGroupCreationError";
import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { UuidGeneratorService } from './../../ports/services/UuidGeneratorService';

export class CreateGroupConversationUseCase {
    constructor(
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
        private readonly uuidGenerator: UuidGeneratorService
    ) {}


    public async execute(name: string, createdBy: string, creatorRole: RoleEnum): Promise<GroupConversationEntity |Error> {
        if(creatorRole != RoleEnum.BANK_MANAGER) {
            return new UnauthorizedGroupCreationError("Only bank managers can create group conversations.");
        }

        const id = this.uuidGenerator.generate();
        const groupConversation = GroupConversationEntity.from(
            id,
            name,
            createdBy,
            new Date(),
            new Date()
        );

        if(groupConversation instanceof Error) {
            return groupConversation;
        }

        const savedGroupConversation = await this.groupConversationRepository.create(groupConversation);
        if(savedGroupConversation instanceof Error) {
            return savedGroupConversation;
        }
        const participantId = this.uuidGenerator.generate();
        const participant = GroupParticipantEntity.from(
            participantId,
            savedGroupConversation.id,
            createdBy,
            creatorRole,
            new Date()
        )
        if(participant instanceof Error) {
            return participant;
        }
        const savedParticipant = await this.groupParticipantRepository.addParticipant(participant);
        if(savedParticipant instanceof Error) {
            return savedParticipant;
        }
        
        return savedGroupConversation;
    }
}