import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { CreateRepaymentScheduleUseCase } from "./CreateRepaymentScheduleUseCase";
import { LoanRequestNotFoundError } from "../../errors/LoanRequestNotFoundError";
import { UnauthorizedLoanRequestError } from "../../errors/UnauthorizedLoanRequestError";
import { RateProposalNotRequiredError } from "../../errors/RateProposalNotRequiredError";
import { IndicativeRateNotDefinedError } from "../../errors/IndicativeRateNotDefinedError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class ClientRespondLoanProposalUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly repaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly createRepaymentScheduleUseCase: CreateRepaymentScheduleUseCase,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

  public async execute(clientId: string, requestId: string, accept: boolean) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new LoanRequestNotFoundError("Loan request not found");
    }

    if (request.clientId !== clientId) {
      return new UnauthorizedLoanRequestError("Unauthorized");
    }

    if (request.status !== LoanStatusEnum.RATE_PROPOSED) {
      return new RateProposalNotRequiredError("No pending proposal");
    }

    request.applyClientDecision(accept);

    if (!accept) {
      const savedRejected = await this.loanRequestRepository.save(request);
      if (savedRejected instanceof Error) {
        return savedRejected;
      }

      if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
          clientId,
          `Vous avez refusé la proposition de prêt de ${request.amount}€ au taux de ${request.proposedRate}%.`,
          NotificationTypeEnum.ACTION
        );
      }

      return savedRejected;
    }

    const accounts = await this.accountRepository.getAccountsByUserId(clientId);
    if (accounts instanceof UserNotFoundError) {
      return accounts;
    }
    const checking = accounts.find((a) => a.accountType === AccountTypeEnum.CHECKING);
    if (!checking) {
      return new AccountNotFoundError("No checking account for client");
    }

    
    if (!request.proposedRate) {
      return new IndicativeRateNotDefinedError("No proposed rate found");
    }
    request.applyRate(request.proposedRate);

    checking.updateBalance(checking.currentBalance + request.amount);
    const savedAccount = await this.accountRepository.updateOneAccount(checking);
    if (savedAccount instanceof Error) {
      return savedAccount;
    }

    const updatedRequest = request.updateStatus(LoanStatusEnum.DISBURSED);
    if (updatedRequest instanceof Error) {
      return updatedRequest;
    }

    const savedRequest = await this.loanRequestRepository.save(request);
    if (savedRequest instanceof Error) {
      return savedRequest;
    }

    await this.createRepaymentScheduleUseCase.execute(
      request.id,
      clientId,
      request.monthlyPayment ?? 0,
      request.amount,
      request.durationMonths,
    );

    if (this.sendNotificationUseCase) {
      await this.sendNotificationUseCase.execute(
        clientId,
        `Félicitations ! Vous avez accepté le prêt de ${request.amount}€ au taux de ${request.proposedRate}%. Les fonds ont été versés sur votre compte.`,
        NotificationTypeEnum.INFO
      );
    }

    return savedRequest;
  }
}

