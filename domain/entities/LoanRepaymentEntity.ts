import { RepaymentStatusEnum } from "../enums/RepaymentStatusEnum";
import { MonthlyAmountValue } from "../values/MonthlyAmountValue";
import { RemainingPrincipalValue } from "../values/RemainingPrincipalValue";
import { DurationMonthsValue } from "../values/DurationMonthsValue";

export class LoanRepaymentEntity {
  public static create(
    id: string,
    loanRequestId: string,
    clientId: string,
    monthlyAmount: number,
    remainingPrincipal: number,
    nextDueDate: Date,
    durationMonths: number,
  ): LoanRepaymentEntity | Error {
    const validatedMonthly = MonthlyAmountValue.from(monthlyAmount);
    if (validatedMonthly instanceof Error) {
      return validatedMonthly;
    }

    const validatedPrincipal = RemainingPrincipalValue.from(remainingPrincipal);
    if (validatedPrincipal instanceof Error) {
      return validatedPrincipal;
    }

    const validatedDuration = DurationMonthsValue.from(durationMonths);
    if (validatedDuration instanceof Error) {
      return validatedDuration;
    }

    return new LoanRepaymentEntity(
      id,
      loanRequestId,
      clientId,
      Number(validatedMonthly.value.toFixed(2)),
      Number(validatedPrincipal.value.toFixed(2)),
      nextDueDate,
      validatedDuration.value,
    );
  }

  private constructor(
    public readonly id: string,
    public readonly loanRequestId: string,
    public readonly clientId: string,
    public readonly monthlyAmount: number,
    public remainingPrincipal: number,
    public nextDueDate: Date,
    public durationMonths: number,
    public paymentsMade: number = 0,
    public status: RepaymentStatusEnum = RepaymentStatusEnum.PAYING,
    public lastFailureReason?: string,
  ) {}

  public markPaid(amount: number) {
    this.remainingPrincipal = Number((this.remainingPrincipal - amount).toFixed(2));
    this.paymentsMade += 1;
  }

  public markFailed(reason: string) {
    this.lastFailureReason = reason;
    this.status = RepaymentStatusEnum.FAILED;
  }

  public markPaidOff() {
    this.status = RepaymentStatusEnum.PAID_OFF;
    this.remainingPrincipal = 0;
  }

  public scheduleNext(periodMs?: number) {
    const next = new Date(this.nextDueDate);
    if (periodMs && periodMs > 0) {
      next.setTime(next.getTime() + periodMs);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    this.nextDueDate = next;
  }
}

