import {LoanRepaymentScheduleRepositoryInterface} from "../../../../application/ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { LoanRepaymentEntity } from "../../../../domain/entities/LoanRepaymentEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresLoanRepaymentRow } from "./types/PostgresLoanRepaymentRow";

export class PostgresLoanRepaymentScheduleRepository implements LoanRepaymentScheduleRepositoryInterface {

  public async create(schedule: LoanRepaymentEntity): Promise<LoanRepaymentEntity | Error> {
    const result = await pgPool.query<PostgresLoanRepaymentRow>(
      `INSERT INTO loan_repayments (
        id, loan_request_id, client_id, monthly_amount, remaining_principal,
        next_due_date, duration_months, payments_made, status, last_failure_reason
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        schedule.id,
        schedule.loanRequestId,
        schedule.clientId,
        schedule.monthlyAmount,
        schedule.remainingPrincipal,
        schedule.nextDueDate,
        schedule.durationMonths,
        schedule.paymentsMade,
        schedule.status,
        schedule.lastFailureReason || null
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new Error('Failed to create loan repayment schedule');
    }

    return this.mapRowToEntity(row);
  }

  public async findActiveByClient(clientId: string): Promise<LoanRepaymentEntity[]> {
    const result = await pgPool.query<PostgresLoanRepaymentRow>(
      `SELECT * FROM loan_repayments
       WHERE client_id = $1 AND status = 'PAYING'
       ORDER BY next_due_date ASC`,
      [clientId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is LoanRepaymentEntity => !(entity instanceof Error));
  }

  public async findByLoanRequest(loanRequestId: string): Promise<LoanRepaymentEntity | null> {
    const result = await pgPool.query<PostgresLoanRepaymentRow>(
      'SELECT * FROM loan_repayments WHERE loan_request_id = $1',
      [loanRequestId]
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

  public async save(schedule: LoanRepaymentEntity): Promise<LoanRepaymentEntity | Error> {
    const existing = await this.findByLoanRequest(schedule.loanRequestId);

    if (existing) {
      const result = await pgPool.query<PostgresLoanRepaymentRow>(
        `UPDATE loan_repayments SET
          monthly_amount = $1,
          remaining_principal = $2,
          next_due_date = $3,
          duration_months = $4,
          payments_made = $5,
          status = $6,
          last_failure_reason = $7
        WHERE id = $8
        RETURNING *`,
        [
          schedule.monthlyAmount,
          schedule.remainingPrincipal,
          schedule.nextDueDate,
          schedule.durationMonths,
          schedule.paymentsMade,
          schedule.status,
          schedule.lastFailureReason || null,
          schedule.id
        ]
      );

      const row = result.rows[0];
      if (!row) {
        return new Error('Failed to update loan repayment schedule');
      }

      return this.mapRowToEntity(row);
    } else {
      return this.create(schedule);
    }
  }

  public async findDue(referenceDate: Date): Promise<LoanRepaymentEntity[]> {
    const result = await pgPool.query<PostgresLoanRepaymentRow>(
      `SELECT * FROM loan_repayments
       WHERE status = 'PAYING' AND next_due_date <= $1
       ORDER BY next_due_date ASC`,
      [referenceDate]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((entity): entity is LoanRepaymentEntity => !(entity instanceof Error));
  }

  private mapRowToEntity(row: PostgresLoanRepaymentRow): LoanRepaymentEntity | Error {
    const entity = LoanRepaymentEntity.create(
      row.id,
      row.loan_request_id,
      row.client_id,
      Number.parseFloat(row.monthly_amount),
      Number.parseFloat(row.remaining_principal),
      row.next_due_date,
      row.duration_months
    );

    if (entity instanceof Error) {
      return entity;
    }

    (entity as any).paymentsMade = row.payments_made;
    (entity as any).status = row.status;
    if (row.last_failure_reason) {
      (entity as any).lastFailureReason = row.last_failure_reason;
    }

    return entity;
  }
}