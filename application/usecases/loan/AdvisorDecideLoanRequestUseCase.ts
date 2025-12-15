import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { LoanDecisionEnum } from "../../../domain/enums/LoanDecisionEnum";

export class AdvisorDecideLoanRequestUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(advisorId: string, requestId: string, decision: LoanDecisionEnum) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.advisorId !== advisorId) {
      return new Error("Unauthorized");
    }

    if (request.status !== LoanStatusEnum.PENDING) {
      return new Error("This request has already been processed");
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

