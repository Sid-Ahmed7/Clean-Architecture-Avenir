import { ContentNotFoundError } from "../../../../application/errors/ContentNotFoundError";
import { ContentRepositoryInterface } from "../../../../application/ports/repositories/news/ContentRepositoryInterface";
import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresContentRow } from "./types/PostgresContentRow";
import { InvalidContentError } from "../../../../domain/errors/InvalidContentError";
export class PostgresContentRepository implements ContentRepositoryInterface {

    async findById(contentId: string): Promise<ContentEntity | ContentNotFoundError> {
        const result = await pgPool.query<PostgresContentRow>(
            'SELECT * FROM contents WHERE id = $1',
            [contentId]
        );

        if (result.rows.length === 0) {
            return new ContentNotFoundError(`Content with ${contentId} not found`);
        }

        const row = result.rows[0];
        if (!row) {
            return new ContentNotFoundError(`Content with ${contentId} not found`);
        }

        return this.mapRowToEntity(row);
    }

    async findByNewsId(newsId: string): Promise<Array<ContentEntity>> {
        const result = await pgPool.query<PostgresContentRow>(
            'SELECT * FROM contents WHERE news_id = $1 ORDER BY "order" ASC',
            [newsId]
        );

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async create(content: ContentEntity): Promise<ContentEntity | InvalidContentError> {
        if (!content) {
            return new InvalidContentError("Error creation content");
        }

        const result = await pgPool.query<PostgresContentRow>(
            `INSERT INTO contents (id, news_id, "order", content)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [content.id, content.newsId, content.order, content.content]
        );

        const row = result.rows[0];
        if (!row) {
            return new InvalidContentError("Failed to create content");
        }

        return this.mapRowToEntity(row);
    }

    async update(content: ContentEntity): Promise<ContentEntity | ContentNotFoundError> {
        const result = await pgPool.query<PostgresContentRow>(
            `UPDATE contents 
             SET news_id = $1, "order" = $2, content = $3
             WHERE id = $4
             RETURNING *`,
            [content.newsId, content.order, content.content, content.id]
        );

        if (result.rows.length === 0) {
            return new ContentNotFoundError(`Content with id ${content.id} not found`);
        }

        const row = result.rows[0];
        if (!row) {
            return new ContentNotFoundError(`Content with ${content.id} not found`);
        }

        return this.mapRowToEntity(row);
    }

    async delete(contentId: string): Promise<void | ContentNotFoundError> {
        const result = await pgPool.query(
            'DELETE FROM contents WHERE id = $1 RETURNING id',
            [contentId]
        );

        if (result.rows.length === 0) {
            return new ContentNotFoundError(`Content with id ${contentId} not found`);
        }
    }

    private mapRowToEntity(row: PostgresContentRow): ContentEntity {
        const content = ContentEntity.from(
            row.id,
            row.news_id,
            row.order,
            row.content
        );
        if (content instanceof Error) {
            return content;
        }
        return content;
    }
}
