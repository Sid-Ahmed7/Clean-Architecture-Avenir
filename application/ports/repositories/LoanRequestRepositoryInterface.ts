import { LoanRequestEntity } from "../../../domain/entities/LoanRequestEntity";

export interface LoanRequestRepositoryInterface {
  create(request: LoanRequestEntity): Promise<LoanRequestEntity | Error>;
  findByAdvisor(advisorId: string): Promise<LoanRequestEntity[]>;
  findByClient(clientId: string): Promise<LoanRequestEntity[]>;
  findById(id: string): Promise<LoanRequestEntity | null>;
  save(request: LoanRequestEntity): Promise<LoanRequestEntity | Error>;
  findAdvisorApproved(): Promise<LoanRequestEntity[]>;
}

