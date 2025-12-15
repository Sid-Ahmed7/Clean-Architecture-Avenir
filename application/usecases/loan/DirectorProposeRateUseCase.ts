import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { InterestRateValue } from "../../../domain/values/InterestRateValue";

export class DirectorProposeRateUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(requestId: string, rate: number, directorName?: string) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new Error("Request not validated by advisor");
    }

    if (request.amount <= 5000) {
      return new Error("Rate proposal not required for amount <= 5000");
    }

    const validatedRate = InterestRateValue.from(rate);
    if (validatedRate instanceof Error) {
      return validatedRate;
    }

    request.proposeRate(validatedRate.value);
    if (directorName) {
      request.setDirectorName(directorName);
    }
    return this.loanRequestRepository.save(request);
  }
}

