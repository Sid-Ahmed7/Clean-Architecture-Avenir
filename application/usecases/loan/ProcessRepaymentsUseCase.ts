import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { RepaymentStatusEnum } from "../../../domain/enums/RepaymentStatusEnum";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { TransactionTypeEnum } from "../../../domain/enums/TransactionTypeEnum";
import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { TransferStatusEnum } from "../../../domain/enums/TransferStatusEnum";
import { RepaymentUserNotFoundError } from "../../errors/RepaymentUserNotFoundError";
import { RepaymentNoCheckingAccountError } from "../../errors/RepaymentNoCheckingAccountError";
import { RepaymentDebitFailedError } from "../../errors/RepaymentDebitFailedError";

export class ProcessRepaymentsUseCase {
  public constructor(
    private readonly scheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(referenceDate: Date = new Date()): Promise<void | Error> {
    const due = await this.scheduleRepository.findDue(referenceDate);
    const periodMs = 60 * 1000;
    for (const schedule of due) {
      const accountsResult = await this.accountRepository.getAccountsByUserId(schedule.clientId);
      if (accountsResult instanceof UserNotFoundError) {
        return new RepaymentUserNotFoundError();
      }

      const checking = accountsResult.find((a) => a.accountType === AccountTypeEnum.CHECKING);
      if (!checking) {
        return new RepaymentNoCheckingAccountError();
      }

      checking.updateBalance(checking.currentBalance - schedule.monthlyAmount);
      const updatedAccount = await this.accountRepository.updateOneAccount(checking);
      if (updatedAccount instanceof AccountNotFoundError || updatedAccount instanceof Error) {
        return new RepaymentDebitFailedError();
      }

      const reference = this.uuidService.generate();
      const tx = TransactionEntity.from(
        reference,
        checking.accountNumber,
        checking.accountNumber, 
        schedule.monthlyAmount,
        TransactionTypeEnum.PAYMENT,
        schedule.clientId,
        TransferStatusEnum.COMPLETED,
        new Date(),
        "Remboursement mensuel",
        "LOAN_REPAYMENT",
      );

      if (tx instanceof TransactionEntity) {
        tx.debitUserId = schedule.clientId;
        tx.creditUserName = "Banque";
        await this.transactionRepository.save(tx);
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

