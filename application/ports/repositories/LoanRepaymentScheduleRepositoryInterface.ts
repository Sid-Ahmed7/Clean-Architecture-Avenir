import { LoanRepaymentSchedule } from "../../../domain/entities/LoanRepaymentSchedule";

export interface LoanRepaymentScheduleRepositoryInterface {
  create(schedule: LoanRepaymentSchedule): Promise<LoanRepaymentSchedule | Error>;
  findActiveByClient(clientId: string): Promise<LoanRepaymentSchedule[]>;
  findByLoanRequest(loanRequestId: string): Promise<LoanRepaymentSchedule | null>;
  save(schedule: LoanRepaymentSchedule): Promise<LoanRepaymentSchedule | Error>;
  findDue(referenceDate: Date): Promise<LoanRepaymentSchedule[]>;
}

