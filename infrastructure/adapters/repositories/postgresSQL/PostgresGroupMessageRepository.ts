import { GroupMessageRepositoryInterface } from "../../../../application/ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupMessageEntity } from "../../../../domain/entities/GroupMessageEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresGroupMessageRow } from "./types/PostgresGroupMessageRow";


export class PostgresGroupMessageRepository implements GroupMessageRepositoryInterface {


    public async create(message: GroupMessageEntity): Promise<GroupMessageEntity> {
        const query = `
            INSERT INTO group_messages (id, group_id, sender_id, sender_role, sender_first_name, sender_last_name, content, created_at, read_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            message.id,
            message.groupId,
            message.senderId,
            message.senderRole,
            message.senderFirstName,
            message.senderLastName,
            message.content,
            message.createdAt,
            message.readBy
        ];
        const result = await pgPool.query<PostgresGroupMessageRow>(query, values);
        return this.mapRowToEntity(result.rows[0]) as GroupMessageEntity;
    }

    public async findByGroupId(groupId: string,limit: number = 50,offset: number = 0): Promise<GroupMessageEntity[]> {
        const query = `
            SELECT * FROM group_messages
            WHERE group_id = $1
            ORDER BY created_at ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await pgPool.query<PostgresGroupMessageRow>(query, [groupId, limit, offset]);
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((entity): entity is GroupMessageEntity => !(entity instanceof Error));
    }

    public async findById(id: string): Promise<GroupMessageEntity | null> {
        const query = `SELECT * FROM group_messages WHERE id = $1`;
        const result = await pgPool.query<PostgresGroupMessageRow>(query, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        const entity = this.mapRowToEntity(result.rows[0]);
        return entity instanceof Error ? null : entity;
    }

    public async markMessageAsRead(messageId: string, userId: string): Promise<void> {
        const query = `
            UPDATE group_messages
            SET read_by = array_append(read_by, $2)
            WHERE id = $1 AND NOT ($2 = ANY(read_by))
        `;
        await pgPool.query(query, [messageId, userId]);
    }

    public async getUnreadCount(groupId: string, userId: string): Promise<number> {
        const query = `
            SELECT COUNT(*) as count
            FROM group_messages
            WHERE group_id = $1 AND NOT ($2 = ANY(read_by))
        `;
        const result = await pgPool.query(query, [groupId, userId]);
        return parseInt(result.rows[0].count, 10);
    }

    private mapRowToEntity(row: PostgresGroupMessageRow): GroupMessageEntity | Error {
        return GroupMessageEntity.from(
            row.id,
            row.group_id,
            row.sender_id,
            row.sender_role,
            row.sender_first_name,
            row.sender_last_name,
            row.content,
            row.created_at,
            row.read_by || []
        );
    }
}