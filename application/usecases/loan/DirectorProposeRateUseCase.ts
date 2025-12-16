import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { InterestRateValue } from "../../../domain/values/InterestRateValue";
import { LoanAmountValue } from "../../../domain/values/LoanAmountValue";
import { LoanNotFoundError } from "../../errors/LoanNotFoundError";
import { LoanNotValidatedByAdvisorError } from "../../errors/LoanNotValidatedByAdvisorError";
import { RateProposalNotRequiredError } from "../../errors/RateProposalNotRequiredError";

export class DirectorProposeRateUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(requestId: string, rate: number, directorName?: string) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new LoanNotFoundError("Loan request not found");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new LoanNotValidatedByAdvisorError("Request not validated by advisor");
    }

    const validatedAmount = LoanAmountValue.from(request.amount);
    if (validatedAmount instanceof Error) {
      return validatedAmount;
    }

    if (validatedAmount.value <= 5000) {
      return new RateProposalNotRequiredError("Rate proposal not required for amount <= 5000");
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

