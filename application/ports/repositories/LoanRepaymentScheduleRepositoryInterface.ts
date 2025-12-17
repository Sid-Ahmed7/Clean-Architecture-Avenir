import { LoanRepaymentEntity } from "../../../domain/entities/LoanRepaymentEntity";

export interface LoanRepaymentScheduleRepositoryInterface {
  create(schedule: LoanRepaymentEntity): Promise<LoanRepaymentEntity | Error>;
  findActiveByClient(clientId: string): Promise<LoanRepaymentEntity[]>;
  findByLoanRequest(loanRequestId: string): Promise<LoanRepaymentEntity | null>;
  save(schedule: LoanRepaymentEntity): Promise<LoanRepaymentEntity | Error>;
  findDue(referenceDate: Date): Promise<LoanRepaymentEntity[]>;
}

