import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { LoanDecisionEnum } from "../../../domain/enums/LoanDecisionEnum";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { LoanConfigService } from "../../ports/services/LoanConfigService";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { CreateRepaymentScheduleUseCase } from "./CreateRepaymentScheduleUseCase";
import { InterestRateValue } from "../../../domain/values/InterestRateValue";
import { LoanNotFoundError } from "../../errors/LoanNotFoundError";
import { RateProposalRequiredError } from "../../errors/RateProposalRequiredError";
import { LoanNotValidatedByAdvisorError } from "../../errors/LoanNotValidatedByAdvisorError";
import { IndicativeRateNotDefinedError } from "../../errors/IndicativeRateNotDefinedError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class DirectorDecideLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly loanConfigService: LoanConfigService,
    private readonly repaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly createRepaymentScheduleUseCase: CreateRepaymentScheduleUseCase,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

  public async execute(
    directorId: string,
    requestId: string,
    decision: LoanDecisionEnum,
    directorName?: string,
  ) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new LoanNotFoundError("Loan request not found");
    }

    if (request.amount > 5000) {
      return new RateProposalRequiredError("Use rate proposal flow for amount > 5000");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new LoanNotValidatedByAdvisorError("Request not validated by advisor");
    }

    const newStatus =
      decision === LoanDecisionEnum.APPROVE
        ? LoanStatusEnum.DIRECTOR_APPROVED
        : LoanStatusEnum.DIRECTOR_REJECTED;

    if (newStatus === LoanStatusEnum.DIRECTOR_REJECTED) {
      request.updateStatus(newStatus);
      const savedRequest = await this.loanRequestRepository.save(request);

      if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
          request.clientId,
          `Votre demande de prêt de ${request.amount}€ a été refusée par le directeur.`,
          NotificationTypeEnum.ALERT,
          directorId,
        );
      }

      return savedRequest;
    }

    const rate = await this.loanConfigService.getIndicativeRate();
    if (rate === null || rate === undefined) {
      return new IndicativeRateNotDefinedError("Indicative rate not defined");
    }
    const validatedRate = InterestRateValue.from(rate);
    if (validatedRate instanceof Error) {
      return validatedRate;
    }
    request.applyRate(validatedRate.value);
    if (directorName) {
      request.setDirectorName(directorName);
    }

    const accounts = await this.accountRepository.getAccountsByUserId(request.clientId);
    if (accounts instanceof UserNotFoundError) {
      return accounts;
    }
    const checking = accounts.find((a) => a.accountType === AccountTypeEnum.CHECKING);
    if (!checking) {
      return new AccountNotFoundError("No checking account for client");
    }

    checking.updateBalance(checking.currentBalance + request.amount);
    const savedAccount = await this.accountRepository.updateOneAccount(checking);
    if (savedAccount instanceof Error) {
      return savedAccount;
    }

    request.updateStatus(LoanStatusEnum.DISBURSED);
    await this.loanRequestRepository.save(request);

    const createdSchedule = await this.createRepaymentScheduleUseCase.execute(
      request.id,
      request.clientId,
      request.monthlyPayment ?? 0,
      request.amount,
      request.durationMonths,
    );
    if (createdSchedule instanceof Error) {
      return createdSchedule;
    }

    if (this.sendNotificationUseCase) {
      await this.sendNotificationUseCase.execute(
        request.clientId,
        `Félicitations ! Votre prêt de ${request.amount}€ a été approuvé et versé sur votre compte.`,
        NotificationTypeEnum.INFO,
        directorId
      );
    }

    return request;
  }
}

