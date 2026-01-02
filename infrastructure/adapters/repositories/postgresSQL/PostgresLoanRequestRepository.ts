
import {LoanRequestRepositoryInterface} from "../../../../application/ports/repositories/LoanRequestRepositoryInterface";
import { LoanRequestEntity } from "../../../../domain/entities/LoanRequestEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresLoanRequestRow } from "./types/PostgresLoanRequestRow";

export class PostgresLoanRequestRepository implements LoanRequestRepositoryInterface {

  public async create(request: LoanRequestEntity): Promise<LoanRequestEntity | Error> {
    const result = await pgPool.query<PostgresLoanRequestRow>(
      `INSERT INTO loan_requests (
        id, client_id, advisor_id, amount, purpose, status, created_at,
        proposed_rate, applied_rate, monthly_payment, client_decision,
        duration_months, advisor_name, director_name, client_name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        request.id,
        request.clientId,
        request.advisorId,
        request.amount,
        request.purpose,
        request.status,
        request.createdAt,
        request.proposedRate || null,
        request.appliedRate || null,
        request.monthlyPayment || null,
        request.clientDecision || null,
        request.durationMonths,
        request.advisorName || null,
        request.directorName || null,
        request.clientName || null
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new Error('Failed to create loan request');
    }

    return this.mapRowToEntity(row);
  }

  public async findByAdvisor(advisorId: string): Promise<LoanRequestEntity[]> {
    const result = await pgPool.query<PostgresLoanRequestRow>(
      'SELECT * FROM loan_requests WHERE advisor_id = $1 ORDER BY created_at DESC',
      [advisorId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is LoanRequestEntity => !(entity instanceof Error));
  }

  public async findByClient(clientId: string): Promise<LoanRequestEntity[]> {
    const result = await pgPool.query<PostgresLoanRequestRow>(
      'SELECT * FROM loan_requests WHERE client_id = $1 ORDER BY created_at DESC',
      [clientId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is LoanRequestEntity => !(entity instanceof Error));
  }

  public async findById(id: string): Promise<LoanRequestEntity | null> {
    const result = await pgPool.query<PostgresLoanRequestRow>(
      'SELECT * FROM loan_requests WHERE id = $1',
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

  public async findAdvisorApproved(): Promise<LoanRequestEntity[]> {
    const result = await pgPool.query<PostgresLoanRequestRow>(
      `SELECT * FROM loan_requests
       WHERE status = 'ADVISOR_APPROVED'
       ORDER BY created_at ASC`
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is LoanRequestEntity => !(entity instanceof Error));
  }

  public async save(request: LoanRequestEntity): Promise<LoanRequestEntity | Error> {
    const existing = await this.findById(request.id);

    if (existing) {
      const result = await pgPool.query<PostgresLoanRequestRow>(
        `UPDATE loan_requests SET
          amount = $1,
          purpose = $2,
          status = $3,
          proposed_rate = $4,
          applied_rate = $5,
          monthly_payment = $6,
          client_decision = $7,
          duration_months = $8,
          advisor_name = $9,
          director_name = $10,
          client_name = $11
        WHERE id = $12
        RETURNING *`,
        [
          request.amount,
          request.purpose,
          request.status,
          request.proposedRate || null,
          request.appliedRate || null,
          request.monthlyPayment || null,
          request.clientDecision || null,
          request.durationMonths,
          request.advisorName || null,
          request.directorName || null,
          request.clientName || null,
          request.id
        ]
      );

      const row = result.rows[0];
      if (!row) {
        return new Error('Failed to update loan request');
      }

      return this.mapRowToEntity(row);
    } else {
      return this.create(request);
    }
  }

  private mapRowToEntity(row: PostgresLoanRequestRow): LoanRequestEntity | Error {
    const entity = LoanRequestEntity.create(
      row.id,
      row.client_id,
      row.advisor_id,
      Number.parseFloat(row.amount),
      row.purpose,
      row.duration_months,
      row.advisor_name || undefined,
      row.director_name || undefined,
      row.client_name || undefined
    );

    if (entity instanceof Error) {
      return entity;
    }

    (entity as any).status = row.status;
    (entity as any).createdAt = row.created_at;
    if (row.proposed_rate) (entity as any).proposedRate =  Number.parseFloat(row.proposed_rate);
    if (row.applied_rate) (entity as any).appliedRate =  Number.parseFloat(row.applied_rate);
    if (row.monthly_payment) (entity as any).monthlyPayment =  Number.parseFloat(row.monthly_payment);
    if (row.client_decision) (entity as any).clientDecision = row.client_decision;

    return entity;
  }
}