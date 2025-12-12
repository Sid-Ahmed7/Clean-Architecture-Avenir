import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";

export class DirectorDecideLoanRequestUseCase {
  public constructor(private readonly loanRequestRepository: LoanRequestRepositoryInterface) {}

  public async execute(requestId: string, decision: "approve" | "reject") {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new Error("Request not validated by advisor");
    }

    const newStatus =
      decision === "approve" ? LoanStatusEnum.DIRECTOR_APPROVED : LoanStatusEnum.DIRECTOR_REJECTED;

    request.updateStatus(newStatus);
    return this.loanRequestRepository.save(request);
  }
}

