import {OverdraftRequestRepositoryInterface} from "../../../../application/ports/repositories/OverdraftRequestRepositoryInterface";
import { OverdraftIncreaseRequestEntity } from "../../../../domain/entities/OverdraftIncreaseRequestEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresOverdraftRequestRow } from "./types/PostgresOverdraftRequestRow";


export class PostgresOverdraftRequestRepository implements OverdraftRequestRepositoryInterface {

  public async create(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity | Error> {
    const result = await pgPool.query<PostgresOverdraftRequestRow>(
      `INSERT INTO overdraft_increase_requests (
        id, account_number, user_id, current_overdraft_limit,
        requested_overdraft_limit, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        request.id,
        request.accountNumber,
        request.userId,
        request.currentOverdraftLimit,
        request.requestedOverdraftLimit,
        request.status,
        request.createdAt
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new Error('Failed to create overdraft request');
    }

    const entity = this.mapRowToEntity(row);
    if (entity instanceof Error) {
      return entity;
    }

    return entity;
  }

  public async findByUserId(userId: string): Promise<OverdraftIncreaseRequestEntity[]> {
    const result = await pgPool.query<PostgresOverdraftRequestRow>(
      'SELECT * FROM overdraft_increase_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is OverdraftIncreaseRequestEntity => !(entity instanceof Error));
  }

  public async findAll(): Promise<OverdraftIncreaseRequestEntity[]> {
    const result = await pgPool.query<PostgresOverdraftRequestRow>(
      'SELECT * FROM overdraft_increase_requests ORDER BY created_at DESC'
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is OverdraftIncreaseRequestEntity => !(entity instanceof Error));
  }

  public async findById(id: string): Promise<OverdraftIncreaseRequestEntity | null> {
    const result = await pgPool.query<PostgresOverdraftRequestRow>(
      'SELECT * FROM overdraft_increase_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const entity = this.mapRowToEntity(row);
    if (entity instanceof Error) {
      return null;
    }

    return entity;
  }

  public async save(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity | Error> {
    const existing = await this.findById(request.id);

    if (existing) {
      const result = await pgPool.query<PostgresOverdraftRequestRow>(
        `UPDATE overdraft_increase_requests SET
          current_overdraft_limit = $1,
          requested_overdraft_limit = $2,
          status = $3
        WHERE id = $4
        RETURNING *`,
        [
          request.currentOverdraftLimit,
          request.requestedOverdraftLimit,
          request.status,
          request.id
        ]
      );

      const row = result.rows[0];
      if (!row) {
        return new Error('Failed to update overdraft request');
      }

      const entity = this.mapRowToEntity(row);
      if (entity instanceof Error) {
        return entity;
      }

      return entity;
    } else {
      return this.create(request);
    }
  }

  private mapRowToEntity(row: PostgresOverdraftRequestRow): OverdraftIncreaseRequestEntity | Error {
    return OverdraftIncreaseRequestEntity.from(
      row.id,
      Number(row.account_number),
      row.user_id,
      Number.parseFloat(row.current_overdraft_limit),
      Number.parseFloat(row.requested_overdraft_limit),
      row.created_at,
      row.status
    );
  }
}