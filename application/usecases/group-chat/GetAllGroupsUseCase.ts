import { GroupConversationEntity } from "../../../domain/entities/GroupConversationEntity";
import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";

export class GetAllGroupsUseCase {
    constructor(
        private readonly groupConversationRepository: GroupConversationRepositoryInterface
    ) {}

    public async execute(): Promise<GroupConversationEntity[]> {
        return await this.groupConversationRepository.findAll();
    }
}
