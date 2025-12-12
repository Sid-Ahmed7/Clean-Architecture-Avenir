import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";

export class ListClientLoanRequestsUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(clientId: string) {
    return this.loanRequestRepository.findByClient(clientId);
  }
}

