import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";

export class ListClientRepaymentsUseCase {
  public constructor(private readonly scheduleRepository: LoanRepaymentScheduleRepositoryInterface) {}

  public async execute(clientId: string) {
    return this.scheduleRepository.findActiveByClient(clientId);
  }
}

