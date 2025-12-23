import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { LoanDecisionEnum } from "../../../domain/enums/LoanDecisionEnum";
import { LoanRequestNotFoundError } from "../../errors/LoanRequestNotFoundError";
import { UnauthorizedLoanRequestError } from "../../errors/UnauthorizedLoanRequestError";
import { RateProposalNotRequiredError } from "../../errors/RateProposalNotRequiredError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class AdvisorDecideLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

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

    if (this.sendNotificationUseCase) {
      const message = decision === LoanDecisionEnum.APPROVE
        ? `Bonne nouvelle ! Votre demande de prêta été approuvée par votre conseiller.`
        : `Votre demande de prêt a été refusée par votre conseiller.`;

      const type = decision === LoanDecisionEnum.APPROVE
        ? NotificationTypeEnum.INFO
        : NotificationTypeEnum.ALERT;

      await this.sendNotificationUseCase.execute(
        request.clientId,
        message,
        type,
        advisorId,

      );
    }

    return savedRequest;
  }
}

