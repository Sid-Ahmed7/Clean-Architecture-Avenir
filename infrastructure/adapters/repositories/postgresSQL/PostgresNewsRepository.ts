import { NewsNotFoundError } from "../../../../application/errors/NewsNotFoundError";
import { NewsRepositoryInterface } from "../../../../application/ports/repositories/news/NewsRepositoryInterface";
import { NewsFilters } from "../../../../application/requests/NewsFilters";
import { NewsEntity } from "../../../../domain/entities/NewsEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresNewsRow } from "./types/PostgresNewsRow";

export class PostgresNewsRepository implements NewsRepositoryInterface {

    async findById(newsId: string): Promise<NewsEntity | NewsNotFoundError> {
        const result = await pgPool.query<PostgresNewsRow>(
            'SELECT * FROM news WHERE id = $1',
            [newsId]
        );

        if (result.rows.length === 0) {
            return new NewsNotFoundError(`News with ${newsId} not found`);
        }

        return this.mapRowToEntity(result.rows[0]);
    }

    async findAll(filters?: NewsFilters, page = 1, limit = 10): Promise<NewsEntity[]> {
        let query = 'SELECT * FROM news WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (filters?.category) {
            query += ` AND category = $${paramIndex}`;
            params.push(filters.category);
            paramIndex++;
        }

        if (filters?.tags && filters.tags.length > 0) {
            query += ` AND tags && $${paramIndex}`;
            params.push(filters.tags);
            paramIndex++;
        }

        if (filters?.priority) {
            query += ` AND priority = $${paramIndex}`;
            params.push(filters.priority);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, (page - 1) * limit);

        const result = await pgPool.query<PostgresNewsRow>(query, params);
        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async create(news: NewsEntity): Promise<NewsEntity> {
        const result = await pgPool.query<PostgresNewsRow>(
            `INSERT INTO news (id, title, category, priority, tags, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [news.id, news.title, news.category, news.priority, news.tags, news.createdAt, news.updatedAt]
        );

        return this.mapRowToEntity(result.rows[0]);
    }

    async update(news: NewsEntity): Promise<NewsEntity | NewsNotFoundError> {
        const result = await pgPool.query<PostgresNewsRow>(
            `UPDATE news 
             SET title = $1, category = $2, priority = $3, tags = $4, updated_at = $5
             WHERE id = $6
             RETURNING *`,
            [news.title, news.category, news.priority, news.tags, news.updatedAt, news.id]
        );

        if (result.rows.length === 0) {
            return new NewsNotFoundError(`News with id ${news.id} not found`);
        }

        return this.mapRowToEntity(result.rows[0]);
    }

    async delete(newsId: string): Promise<void | NewsNotFoundError> {
        const result = await pgPool.query(
            'DELETE FROM news WHERE id = $1 RETURNING id',
            [newsId]
        );

        if (result.rows.length === 0) {
            return new NewsNotFoundError(`News with id ${newsId} not found`);
        }
    }

    private mapRowToEntity(row: PostgresNewsRow): NewsEntity {
        return {
            id: row.id,
            title: row.title,
            category: row.category,
            priority: row.priority,
            tags: row.tags,
            createdAt: row.created_at,
            updatedAt: row.updated_at ?? undefined
        } as NewsEntity;
    }
}