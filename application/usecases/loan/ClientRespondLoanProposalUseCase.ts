import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { CreateRepaymentScheduleUseCase } from "./CreateRepaymentScheduleUseCase";

export class ClientRespondLoanProposalUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly repaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly createRepaymentScheduleUseCase: CreateRepaymentScheduleUseCase,
  ) {}

  public async execute(clientId: string, requestId: string, accept: boolean) {
    const request = await this.loanRequestRepository.findById(requestId);
    if (!request) {
      return new Error("Loan request not found");
    }

    if (request.clientId !== clientId) {
      return new Error("Unauthorized");
    }

    if (request.status !== LoanStatusEnum.RATE_PROPOSED) {
      return new Error("No pending proposal");
    }

    request.applyClientDecision(accept);

    if (!accept) {
      await this.loanRequestRepository.save(request);
      return request;
    }

    // credit amount to client's checking account
    const accounts = await this.accountRepository.getAccountsByUserId(clientId);
    if (accounts instanceof UserNotFoundError) {
      return accounts;
    }
    const checking = accounts.find((a) => a.accountType === AccountTypeEnum.CHECKING);
    if (!checking) {
      return new AccountNotFoundError("No checking account for client");
    }

    
    if (!request.proposedRate) {
      return new Error("No proposed rate found");
    }
    request.applyRate(request.proposedRate);

    checking.updateBalance(checking.currentBalance + request.amount);
    const savedAccount = await this.accountRepository.updateOneAccount(checking);
    if (savedAccount instanceof Error) {
      return savedAccount;
    }

    request.updateStatus(LoanStatusEnum.DISBURSED);
    await this.loanRequestRepository.save(request);

    await this.createRepaymentScheduleUseCase.execute(
      request.id,
      clientId,
      request.monthlyPayment ?? 0,
      request.amount,
      request.durationMonths,
    );

    return request;
  }
}

