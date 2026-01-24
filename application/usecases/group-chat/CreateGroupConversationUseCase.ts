import { GroupConversationEntity } from "../../../domain/entities/GroupConversationEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UnauthorizedGroupCreationError } from "../../errors/UnauthorizedGroupCreationError";
import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { UuidGeneratorService } from './../../ports/services/UuidGeneratorService';

export class CreateGroupConversationUseCase {
    constructor(
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
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
        return savedGroupConversation;
    }
}