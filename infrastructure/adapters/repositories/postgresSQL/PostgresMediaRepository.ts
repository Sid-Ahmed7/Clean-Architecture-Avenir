import { MediaNotFoundError } from "../../../../application/errors/MediaNotFoundError";
import { MediaRepositoryInterface } from "../../../../application/ports/repositories/news/MediaRepositoryInterface";
import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";
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

    async findByNewsId(newsId: string): Promise<MediaEntity[]> {
        const result = await pgPool.query<PostgresMediaRow>(
            'SELECT * FROM media WHERE news_id = $1 ORDER BY "order" ASC',
            [newsId]
        );
        if (result.rows.length === 0) {
            // Return empty array if no media found, matching interface
            return [];
        }
        const entities = result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((e): e is MediaEntity => !(e instanceof Error));
        return entities;
    }

    async findByIds(mediaIds: string[]): Promise<MediaEntity[]> {
        const result = await pgPool.query<PostgresMediaRow>(
            'SELECT * FROM media WHERE id = ANY($1)',
            [mediaIds]
        );
        if (result.rows.length === 0) {
            // Return empty array if no media found, matching interface
            return [];
        }
        const entities = result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((e): e is MediaEntity => !(e instanceof Error));
        return entities;
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
                media.caption ?? null,
                media.size ?? null,
                media.mimeType ?? null,
                new Date()
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

    private mapRowToEntity(row: PostgresMediaRow): MediaEntity | InvalidUrlMediaError  {
        let domainType: MediaTypeEnum;
        if (row.type === MediaTypeEnum.VIDEO) {
            domainType = MediaTypeEnum.VIDEO;
        } else if (row.type === MediaTypeEnum.IMAGE) {
            domainType = MediaTypeEnum.IMAGE;
        } else {
            return new InvalidUrlMediaError(`Unsupported media type: ${row.type}`);
        }

        const media = MediaEntity.from(
            row.id,
            row.news_id,
            row.url,
            domainType,
            row.order,
            row.alt_text,
            row.caption ?? undefined,
            row.size ?? undefined,
            row.mime_type ?? undefined
        );
        if (media instanceof Error) {
            return media;
        }
        return media;
    }
}
