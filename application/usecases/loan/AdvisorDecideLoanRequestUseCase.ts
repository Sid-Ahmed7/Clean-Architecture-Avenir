import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { LoanDecisionEnum } from "../../../domain/enums/LoanDecisionEnum";
import { LoanRequestNotFoundError } from "../../errors/LoanRequestNotFoundError";
import { UnauthorizedLoanRequestError } from "../../errors/UnauthorizedLoanRequestError";
import { RateProposalNotRequiredError } from "../../errors/RateProposalNotRequiredError";

export class AdvisorDecideLoanRequestUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(advisorId: string, requestId: string, decision: LoanDecisionEnum) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new LoanRequestNotFoundError("Loan request not found");
    }

    if (request.advisorId !== advisorId) {
      return new UnauthorizedLoanRequestError("Unauthorized");
    }

    if (request.status !== LoanStatusEnum.PENDING) {
      return new RateProposalNotRequiredError("This request has already been processed");
    }

    const newStatus =
      decision === LoanDecisionEnum.APPROVE
        ? LoanStatusEnum.ADVISOR_APPROVED
        : LoanStatusEnum.ADVISOR_REJECTED;

    const updatedRequest = request.updateStatus(newStatus);
    if (updatedRequest instanceof Error) {
      return updatedRequest;
    }

    const savedRequest = await this.loanRequestRepository.save(request);
    if (savedRequest instanceof Error) {
      return savedRequest;
    }

    return savedRequest;
  }
}

