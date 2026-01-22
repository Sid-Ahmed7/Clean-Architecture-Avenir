import { GroupConversationNotFoundError } from "../../../application/errors/GroupConversationNotFoundError";
import { GroupConversationRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupConversationEntity } from "../../../domain/entities/GroupConversationEntity";

export class InMemoryGroupConversationRepository implements GroupConversationRepositoryInterface {
    private readonly conversations: Array<GroupConversationEntity>;

    public constructor() {
        this.conversations = [];
    }

    public async create(group: GroupConversationEntity): Promise<GroupConversationEntity> {
        this.conversations.push(group);
        return group;
    }

    public async findById(id: string): Promise<GroupConversationEntity | GroupConversationNotFoundError> {
        const conversation = this.conversations.find((c) => c.id === id);

        if (!conversation) {
            return new GroupConversationNotFoundError(`Group conversation with id ${id} not found`);
        }

        return conversation;
    }

    public async findAll(): Promise<GroupConversationEntity[]> {
        return this.conversations;
    }

    public async update(group: GroupConversationEntity): Promise<GroupConversationEntity> {
        const index = this.conversations.findIndex((c) => c.id === group.id);

        if (index === -1) {
            this.conversations.push(group);
        } else {
            this.conversations[index] = group;
        }

        return group;
    }

    public async delete(id: string): Promise<void> {
        const index = this.conversations.findIndex((c) => c.id === id);

        if (index !== -1) {
            this.conversations.splice(index, 1);
        }
    }
}
