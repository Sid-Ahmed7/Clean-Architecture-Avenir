import { MediaNotFoundError } from "../../../../application/errors/MediaNotFoundError";
import { MediaRepositoryInterface } from "../../../../application/ports/repositories/news/MediaRepositoryInterface";
import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresMediaRow } from "./types/PostgresMediaRow";
import { InvalidUrlMediaError } from "../../../../domain/errors/InvalidUrlMediaError";

export class PostgresMediaRepository implements MediaRepositoryInterface {

    async findById(mediaId: string): Promise<MediaEntity | MediaNotFoundError> {
        const result = await pgPool.query<PostgresMediaRow>(
            'SELECT * FROM media WHERE id = $1',
            [mediaId]
        );

        if (result.rows.length === 0) {
            return new MediaNotFoundError(`Media with id ${mediaId} not found`);
        }

        const row = result.rows[0];
        if (!row) {
            return new MediaNotFoundError(`Media with id ${mediaId} not found`);
        }

        return this.mapRowToEntity(row);
    }

    async findByNewsId(newsId: string): Promise<Array<MediaEntity>> {
        const result = await pgPool.query<PostgresMediaRow>(
            'SELECT * FROM media WHERE news_id = $1 ORDER BY "order" ASC',
            [newsId]
        );

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async findByIds(mediaIds: string[]): Promise<MediaEntity[] | MediaNotFoundError> {
        const result = await pgPool.query<PostgresMediaRow>(
            'SELECT * FROM media WHERE id = ANY($1)',
            [mediaIds]
        );

        if (result.rows.length === 0) {
            return new MediaNotFoundError(`No media found for given IDs`);
        }

        return result.rows.map(row => this.mapRowToEntity(row));
    }

    async create(media: MediaEntity): Promise<MediaEntity | InvalidUrlMediaError> {
        if (!media) {
            return new InvalidUrlMediaError("Error creation media");
        }

        const result = await pgPool.query<PostgresMediaRow>(
            `INSERT INTO media (id, news_id, url, type, "order", alt_text, caption, size, mime_type, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                media.id,
                media.newsId,
                media.url,
                media.type,
                media.order,
                media.altText,
                media.caption,
                media.size,
                media.mimeType,
            ]
        );

        const row = result.rows[0];

        if (!row) {
            return new MediaNotFoundError(`Media with id ${media.id} not found`);

        }   

        return this.mapRowToEntity(row); 
    }

    async update(media: MediaEntity): Promise<MediaEntity | MediaNotFoundError> {
        const result = await pgPool.query<PostgresMediaRow>(
            `UPDATE media 
             SET news_id = $1, url = $2, type = $3, "order" = $4, alt_text = $5, 
                 caption = $6, size = $7, mime_type = $8
             WHERE id = $9
             RETURNING *`,
            [
                media.newsId,
                media.url,
                media.type,
                media.order,
                media.altText,
                media.caption,
                media.size,
                media.mimeType,
                media.id
            ]
        );

        if (result.rows.length === 0) {
            return new MediaNotFoundError(`Media with id ${media.id} not found`);
        }

        const row = result.rows[0];

        if (!row) {
            return new MediaNotFoundError(`Media with id ${media.id} not found`);

        }   

        return this.mapRowToEntity(row)
    }

    async delete(mediaId: string): Promise<void | MediaNotFoundError> {
        const result = await pgPool.query(
            'DELETE FROM media WHERE id = $1 RETURNING id',
            [mediaId]
        );

        if (result.rows.length === 0) {
            return new MediaNotFoundError(`Media with id ${mediaId} not found`);
        }
    }

    private mapRowToEntity(row: PostgresMediaRow): MediaEntity {
        return {
            id: row.id,
            newsId: row.news_id,
            url: row.url,
            type: row.type,
            order: row.order,
            altText: row.alt_text,
            caption: row.caption ?? undefined,
            size: row.size ?? undefined,
            mimeType: row.mime_type ?? undefined,
            createdAt: row.created_at
        } as MediaEntity;
    }
}
