import {GroupMessageEntity} from "../../../../domain/entities/GroupMessageEntity";

export interface GroupMessageRepositoryInterface {

    create(message: GroupMessageEntity): Promise<GroupMessageEntity>;
    findByGroupId(groupId: string, limit?: number, offset?: number): Promise<GroupMessageEntity[]>;
    findById(id: string): Promise<GroupMessageEntity | null>;
    markMessageAsRead(messageId: string, userId: string): Promise<void>;
    getUnreadCount(groupId: string, userId: string): Promise<number>;

}