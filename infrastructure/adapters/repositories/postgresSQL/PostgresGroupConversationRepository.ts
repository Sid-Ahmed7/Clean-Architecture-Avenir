import { GroupConversationRepositoryInterface } from "../../../../application/ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupConversationEntity } from "../../../../domain/entities/GroupConversationEntity";
import { PostgresGroupConversationRow } from "./types/PostgresGroupConversationRow";
import { pgPool } from "../../config/database/configPostgresSQL";
import { GroupConversationNotFoundError } from "../../../../application/errors/GroupConversationNotFoundError";


export class PostgresGroupConversationRepository implements GroupConversationRepositoryInterface {

    public async create(group: GroupConversationEntity): Promise<GroupConversationEntity> {
        const query = `
            INSERT INTO group_conversations (id, name, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [group.id, group.name, group.createdBy, group.createdAt, group.updatedAt];
        const result = await pgPool.query<PostgresGroupConversationRow>(query, values);
        return this.mapRowToEntity(result.rows[0]) as GroupConversationEntity;
    }

    public async findById(id: string): Promise<GroupConversationEntity | GroupConversationNotFoundError> {
        const query = `SELECT * FROM group_conversations WHERE id = $1`;
        const result = await pgPool.query<PostgresGroupConversationRow>(query, [id]);

        if (result.rows.length === 0) {
            return new GroupConversationNotFoundError(`Group conversation with id ${id} not found`);
        }

        const entity = this.mapRowToEntity(result.rows[0]);
        if (entity instanceof Error) {
            return new GroupConversationNotFoundError(entity.message);
        }
        return entity;
    }

    public async findAll(): Promise<GroupConversationEntity[]> {
        const query = `SELECT * FROM group_conversations ORDER BY created_at DESC`;
        const result = await pgPool.query<PostgresGroupConversationRow>(query);
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((entity): entity is GroupConversationEntity => !(entity instanceof Error));
    }

    public async update(group: GroupConversationEntity): Promise<GroupConversationEntity> {
        const query = `
            UPDATE group_conversations
            SET name = $2, updated_at = $3
            WHERE id = $1
            RETURNING *
        `;
        const values = [group.id, group.name, new Date()];
        const result = await pgPool.query<PostgresGroupConversationRow>(query, values);
        return this.mapRowToEntity(result.rows[0]) as GroupConversationEntity;
    }

    public async delete(id: string): Promise<void> {
        await pgPool.query(`DELETE FROM group_conversations WHERE id = $1`, [id]);
    }

        private mapRowToEntity(row: PostgresGroupConversationRow): GroupConversationEntity | Error {
        return GroupConversationEntity.from(
            row.id,
            row.name,
            row.created_by,
            row.created_at,
            row.updated_at
        );
    }
}