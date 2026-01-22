import { GroupParticipantRepositoryInterface } from "../../../../application/ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { GroupParticipantEntity } from "../../../../domain/entities/GroupParticipantEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresGroupParticipantRow } from "./types/PostgresGroupParticipantRow";


export class PostgresGroupParticipantRepository implements GroupParticipantRepositoryInterface {
 
    public async addParticipant(participant: GroupParticipantEntity): Promise<GroupParticipantEntity> {
        const query = `
            INSERT INTO group_participants (id, group_id, user_id, role, joined_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [
            participant.id,
            participant.groupId,
            participant.userId,
            participant.role,
            participant.joinedAt
        ];
        const result = await pgPool.query<PostgresGroupParticipantRow>(query, values);
        return this.mapRowToEntity(result.rows[0]) as GroupParticipantEntity;
    }

    public async removeParticipant(groupId: string, userId: string): Promise<void> {
        await pgPool.query(
            `DELETE FROM group_participants WHERE group_id = $1 AND user_id = $2`,
            [groupId, userId]
        );
    }

    public async findByGroupId(groupId: string): Promise<GroupParticipantEntity[]> {
        const query = `SELECT * FROM group_participants WHERE group_id = $1 ORDER BY joined_at ASC`;
        const result = await pgPool.query<PostgresGroupParticipantRow>(query, [groupId]);
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((entity): entity is GroupParticipantEntity => !(entity instanceof Error));
    }

    public async findByUserId(userId: string): Promise<GroupParticipantEntity[]> {
        const query = `SELECT * FROM group_participants WHERE user_id = $1`;
        const result = await pgPool.query<PostgresGroupParticipantRow>(query, [userId]);
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((entity): entity is GroupParticipantEntity => !(entity instanceof Error));
    }

    public async isParticipant(groupId: string, userId: string): Promise<boolean> {
        const query = `SELECT 1 FROM group_participants WHERE group_id = $1 AND user_id = $2`;
        const result = await pgPool.query(query, [groupId, userId]);
        return result.rows.length > 0;
    }

       private mapRowToEntity(row: PostgresGroupParticipantRow): GroupParticipantEntity | Error {
        return GroupParticipantEntity.from(
            row.id,
            row.group_id,
            row.user_id,
            row.role,
            row.joined_at
        );
    }

}