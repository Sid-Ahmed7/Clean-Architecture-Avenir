import { MessageNotFoundError } from "../../../../application/errors/chat/MessageNotFoundError";
import { ConversationNotFoundError } from "../../../../application/errors/chat/ConversationNotFoundError";
import { MessageRepositoryInterface } from "../../../../application/ports/repositories/chat/MessageRepositoryInterface";
import { MessageEntity } from "../../../../domain/entities/MessageEntity";
import { InvalidMessageError } from "../../../../domain/errors/InvalidMessageError";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresMessageRow } from "./types/PostgresMessageRow";
import { ReadStatusEnum } from "./types/PostgresEnums";

export class PostgresMessageRepository implements MessageRepositoryInterface {

    async findById(messageId: string): Promise<MessageEntity | MessageNotFoundError> {
        const result = await pgPool.query<PostgresMessageRow>(
            'SELECT * FROM messages WHERE id = $1',
            [messageId]
        );

        if (result.rows.length === 0) {
            return new MessageNotFoundError("Message not found");
        }

        const row = result.rows[0];
        
        if (!row) {
            return new MessageNotFoundError("Message not found");
        
        }   
        
        return this.mapRowToEntity(row)
    }

    async findUnreadByRecipient(userId: string): Promise<Array<MessageEntity>> {
        const result = await pgPool.query<PostgresMessageRow>(
            `SELECT * FROM messages 
             WHERE author_id != $1 
             AND read_status = $2`,
            [userId, ReadStatusEnum.UNREAD]
        );

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async findByConversationId(conversationId: string): Promise<MessageEntity[] | ConversationNotFoundError> {
        console.log('🔍 [PostgresMessageRepository] Finding messages for conversation:', conversationId);
        
        const result = await pgPool.query<PostgresMessageRow>(
            'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC',
            [conversationId]
        );

        console.log('🔍 [PostgresMessageRepository] Query result rows:', result.rows.length);

        if (result.rows.length === 0) {
            console.log('⚠️ [PostgresMessageRepository] No messages found for conversation (returning empty array)');
            return []; // Retourner un tableau vide au lieu d'une erreur
        }

        console.log('✅ [PostgresMessageRepository] Returning', result.rows.length, 'messages');
        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async save(message: MessageEntity): Promise<MessageEntity | InvalidMessageError> {
        if (!message.authorId) {
            return new InvalidMessageError("Message must have an author");
        }

        const result = await pgPool.query<PostgresMessageRow>(
            `INSERT INTO messages (
                id, conversation_id, conversation_client_id, conversation_advisor_id,
                author_id, content, read_status, sent_at
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                message.id,
                message.conversationId,
                message.conversationClientId,
                message.conversationAdvisorId,
                message.authorId,
                message.content,
                message.readStatus,
                message.sentAt
            ]
        );

        const row = result.rows[0];
        
        if (!row) {
            return new MessageNotFoundError("Message not found");
        
        }   
        
        return this.mapRowToEntity(row)
    }

    async updateMessage(message: MessageEntity): Promise<MessageEntity | MessageNotFoundError> {
        const result = await pgPool.query<PostgresMessageRow>(
            `UPDATE messages 
             SET content = $1, read_status = $2
             WHERE id = $3
             RETURNING *`,
            [message.content, message.readStatus, message.id]
        );

        if (result.rows.length === 0) {
            return new MessageNotFoundError(`Message with id ${message.id} not found`);
        }

        const row = result.rows[0];
        if (!row) {
            return new MessageNotFoundError("Message not found");
        }

        return this.mapRowToEntity(row);
    }

    private mapRowToEntity(row: PostgresMessageRow): MessageEntity {
        const message = MessageEntity.from(
            row.id,
            row.conversation_id,
            row.conversation_client_id,
            row.conversation_advisor_id ?? undefined,
            row.author_id,
            row.content,
            row.read_status,
            row.sent_at
        );
        if( message instanceof Error) {
            return message;
        }
        return message;

    }
}