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
    const periodMs =
      process.env.REPAYMENT_PERIOD_MS && Number(process.env.REPAYMENT_PERIOD_MS) > 0
        ? Number(process.env.REPAYMENT_PERIOD_MS)
        : 0;
    for (const schedule of due) {
      const accounts = await this.accountRepository.getAccountsByUserId(schedule.clientId);
      if (accounts instanceof UserNotFoundError) {
        schedule.markFailed("User not found");
        await this.scheduleRepository.save(schedule);
        continue;
      }
      const checking = accounts.find((a) => a.accountType === AccountTypeEnum.CHECKING);
      if (!checking) {
        schedule.markFailed("No checking account");
        await this.scheduleRepository.save(schedule);
        continue;
      }

      checking.updateBalance(checking.currentBalance - schedule.monthlyAmount);
      const updatedAccount = await this.accountRepository.updateOneAccount(checking);
      if (updatedAccount instanceof AccountNotFoundError || updatedAccount instanceof Error) {
        schedule.markFailed("Debit failed");
        await this.scheduleRepository.save(schedule);
        continue;
      }

      schedule.markPaid(schedule.monthlyAmount);

      if (schedule.paymentsMade >= schedule.durationMonths || schedule.remainingPrincipal <= 0) {
        schedule.markPaidOff();
      } else {
        schedule.scheduleNext(periodMs);
      }

      await this.scheduleRepository.save(schedule);
    }
  }
}

