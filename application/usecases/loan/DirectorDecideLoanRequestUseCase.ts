import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { LoanConfigRepositoryInterface } from "../../ports/repositories/LoanConfigRepositoryInterface";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { CreateRepaymentScheduleUseCase } from "./CreateRepaymentScheduleUseCase";

export class DirectorDecideLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly loanConfigRepository: LoanConfigRepositoryInterface,
    private readonly repaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly createRepaymentScheduleUseCase: CreateRepaymentScheduleUseCase,
  ) {}

  public async execute(requestId: string, decision: "approve" | "reject", directorName?: string) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.amount > 5000) {
      return new Error("Use rate proposal flow for amount > 5000");
    }

    if (request.status !== LoanStatusEnum.ADVISOR_APPROVED) {
      return new Error("Request not validated by advisor");
    }

    const newStatus =
      decision === "approve" ? LoanStatusEnum.DIRECTOR_APPROVED : LoanStatusEnum.DIRECTOR_REJECTED;

    if (newStatus === LoanStatusEnum.DIRECTOR_REJECTED) {
      request.updateStatus(newStatus);
      return this.loanRequestRepository.save(request);
    }

    // approve path: apply indicative rate and disburse
    const rate = await this.loanConfigRepository.getIndicativeRate();
    if (rate === null || rate <= 0) {
      return new Error("Indicative rate not defined");
    }
    request.applyRate(rate);
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

    await this.createRepaymentScheduleUseCase.execute(
      request.id,
      request.clientId,
      request.monthlyPayment ?? 0,
      request.amount,
      request.durationMonths,
    );

    return request;
  }
}

