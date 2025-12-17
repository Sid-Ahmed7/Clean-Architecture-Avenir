import { ConversationNotFoundError } from "../../../../application/errors/chat/ConversationNotFoundError";
import { UserNotFoundError } from "../../../../application/errors/UserNotFoundError";
import { ConversationRepositoryInterface } from "../../../../application/ports/repositories/chat/ConversationRepositoryInterface";
import { ConversationEntity } from "../../../../domain/entities/ConversationEntity";
import { InvalidConversationError } from "../../../../domain/errors/InvalidConversationError";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresConversationRow } from "./types/PostgresConversationRow";

export class PostgresConversationRepository implements ConversationRepositoryInterface {

    async findByConversationId(conversationId: string): Promise<ConversationEntity | ConversationNotFoundError> {
        const result = await pgPool.query<PostgresConversationRow>(
            'SELECT * FROM conversations WHERE id = $1',
            [conversationId]
        );

        if (result.rows.length === 0) {
            return new ConversationNotFoundError(`Conversation with id ${conversationId} not found`);
        }

        return this.mapRowToEntity(result.rows[0]);
    }

    async findByAdvisorId(advisorId: string): Promise<Array<ConversationEntity> | UserNotFoundError> {
        const result = await pgPool.query<PostgresConversationRow>(
            'SELECT * FROM conversations WHERE advisor_id = $1',
            [advisorId]
        );

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async findByClientId(clientId: string): Promise<Array<ConversationEntity> | UserNotFoundError> {
        const result = await pgPool.query<PostgresConversationRow>(
            'SELECT * FROM conversations WHERE client_id = $1',
            [clientId]
        );

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async findAll(): Promise<Array<ConversationEntity>> {
        const result = await pgPool.query<PostgresConversationRow>('SELECT * FROM conversations');
        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async save(conversation: ConversationEntity): Promise<void | InvalidConversationError> {
        if (!conversation.clientId) {
            return new InvalidConversationError("Conversation must have a clientId");
        }

        const exists = await pgPool.query(
            'SELECT id FROM conversations WHERE client_id = $1 AND advisor_id = $2',
            [conversation.clientId, conversation.advisorId]
        );

        if (exists.rows.length > 0) {
            return new InvalidConversationError("This advisor is already assigned to this conversation");
        }

        await pgPool.query(
            `INSERT INTO conversations (id, client_id, advisor_id, created_at)
             VALUES ($1, $2, $3, $4)`,
            [conversation.id, conversation.clientId, conversation.advisorId, conversation.createdAt]
        );
    }

    async update(conversation: ConversationEntity): Promise<void | ConversationNotFoundError> {
        const result = await pgPool.query(
            `UPDATE conversations 
             SET advisor_id = $1
             WHERE client_id = $2
             RETURNING *`,
            [conversation.advisorId, conversation.clientId]
        );

        if (result.rows.length === 0) {
            return new ConversationNotFoundError("Conversation not found for this client");
        }
    }

    private mapRowToEntity(row: PostgresConversationRow): ConversationEntity {
        return {
            id: row.id,
            clientId: row.client_id,
            advisorId: row.advisor_id ?? undefined,
            createdAt: row.created_at
        } as ConversationEntity;
    }
}
