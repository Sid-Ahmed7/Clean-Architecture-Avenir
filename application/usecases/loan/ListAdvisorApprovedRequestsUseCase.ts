import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";

export class ListAdvisorApprovedRequestsUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute() {
    return this.loanRequestRepository.findAdvisorApproved();
  }
}

