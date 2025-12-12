import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";

export class ClientRespondLoanProposalUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
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

    checking.updateBalance(checking.currentBalance + request.amount);
    const savedAccount = await this.accountRepository.updateOneAccount(checking);
    if (savedAccount instanceof Error) {
      return savedAccount;
    }

    request.updateStatus(LoanStatusEnum.DISBURSED);
    return this.loanRequestRepository.save(request);
  }
}

