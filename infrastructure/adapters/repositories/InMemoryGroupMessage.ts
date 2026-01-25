import { GroupMessageRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupMessageEntity } from "../../../domain/entities/GroupMessageEntity";

export class InMemoryGroupMessageRepository implements GroupMessageRepositoryInterface {
    private readonly messages: Array<GroupMessageEntity>;

    public constructor() {
        this.messages = [];
    }

    public async create(message: GroupMessageEntity): Promise<GroupMessageEntity> {
        this.messages.push(message);
        return message;
    }

    public async findByGroupId(groupId: string, limit?: number, offset?: number): Promise<GroupMessageEntity[]> {
        let result = this.messages
            .filter((m) => m.groupId === groupId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        if (offset !== undefined) {
            result = result.slice(offset);
        }

        if (limit !== undefined) {
            result = result.slice(0, limit);
        }

        return result;
    }

    public async findById(id: string): Promise<GroupMessageEntity | null> {
        const message = this.messages.find((m) => m.id === id);
        return message || null;
    }

    public async markMessageAsRead(messageId: string, userId: string): Promise<void> {
        const index = this.messages.findIndex((m) => m.id === messageId);

        if (index !== -1) {
            const message = this.messages[index];
            this.messages[index] = message.markAsReadBy(userId);
        }
    }

    public async markAllMessagesAsRead(groupId: string, userId: string): Promise<void> {
        for (let i = 0; i < this.messages.length; i++) {
            const message = this.messages[i];
            if (message.groupId === groupId && !message.readBy.includes(userId)) {
                this.messages[i] = message.markAsReadBy(userId);
            }
        }
    }

    public async getUnreadCount(groupId: string, userId: string): Promise<number> {
        return this.messages.filter(
            (m) => m.groupId === groupId && !m.readBy.includes(userId)
        ).length;
    }
}
