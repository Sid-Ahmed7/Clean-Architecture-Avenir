import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";

export class AdvisorDecideLoanRequestUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(advisorId: string, requestId: string, decision: "approve" | "reject") {
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
      decision === "approve" ? LoanStatusEnum.ADVISOR_APPROVED : LoanStatusEnum.ADVISOR_REJECTED;

    request.updateStatus(newStatus);
    return this.loanRequestRepository.save(request);
  }
}

