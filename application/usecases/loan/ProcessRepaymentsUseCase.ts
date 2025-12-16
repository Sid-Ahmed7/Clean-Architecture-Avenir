import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { RepaymentStatusEnum } from "../../../domain/enums/RepaymentStatusEnum";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";

export class ProcessRepaymentsUseCase {
  public constructor(
    private readonly scheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(referenceDate: Date = new Date()) {
    const due = await this.scheduleRepository.findDue(referenceDate);
    const periodMs = 60 * 1000;
    for (const schedule of due) {
      const accountsResult = await this.accountRepository.getAccountsByUserId(schedule.clientId);
      let failureMessage: string | null = null;

      if (accountsResult instanceof UserNotFoundError) {
        failureMessage = "User not found";
      } else {
        const checking = accountsResult.find((a) => a.accountType === AccountTypeEnum.CHECKING);
        if (!checking) {
          failureMessage = "No checking account";
        } else {
          checking.updateBalance(checking.currentBalance - schedule.monthlyAmount);
          const updatedAccount = await this.accountRepository.updateOneAccount(checking);
          if (updatedAccount instanceof AccountNotFoundError || updatedAccount instanceof Error) {
            failureMessage = "Debit failed";
          } else {
            schedule.markPaid(schedule.monthlyAmount);
            if (schedule.paymentsMade >= schedule.durationMonths || schedule.remainingPrincipal <= 0) {
              schedule.markPaidOff();
            } else {
              schedule.scheduleNext(periodMs);
            }
          }
        }
      }

      if (failureMessage) {
        schedule.markFailed(failureMessage);
      }
      await this.scheduleRepository.save(schedule);
    }
  }
}

