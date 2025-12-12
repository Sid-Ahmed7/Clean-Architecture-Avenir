import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";

export class DirectorProposeRateUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(requestId: string, rate: number) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new Error("Request not validated by advisor");
    }

    if (typeof rate !== "number" || Number.isNaN(rate) || rate <= 0) {
      return new Error("Invalid rate");
    }

    request.proposeRate(rate);
    return this.loanRequestRepository.save(request);
  }
}

