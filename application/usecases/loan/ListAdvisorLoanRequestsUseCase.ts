import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";

export class ListAdvisorLoanRequestsUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(advisorId: string) {
    return this.loanRequestRepository.findByAdvisor(advisorId);
  }
}

