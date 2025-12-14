import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { LoanRepaymentEntity } from "../../../domain/entities/LoanRepaymentEntity";
import { RepaymentStatusEnum } from "../../../domain/enums/RepaymentStatusEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class CreateRepaymentScheduleUseCase {
  public constructor(
    private readonly scheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(
    loanRequestId: string,
    clientId: string,
    monthlyAmount: number,
    remainingPrincipal: number,
    durationMonths: number,
  ) {
    if (monthlyAmount <= 0 || remainingPrincipal <= 0 || durationMonths <= 0) {
      return new Error("Invalid repayment parameters");
    }

    const id = this.uuidService.generate();
    const nextDueDate = new Date();
    const delayMs = process.env.REPAYMENT_DELAY_MS ? Number(process.env.REPAYMENT_DELAY_MS) : 0;

    if (delayMs && delayMs > 0) {
      nextDueDate.setTime(nextDueDate.getTime() + delayMs);
    } else {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    const schedule = new LoanRepaymentEntity(
      id,
      loanRequestId,
      clientId,
      Number(monthlyAmount.toFixed(2)),
      Number(remainingPrincipal.toFixed(2)),
      nextDueDate,
      durationMonths,
      0,
      RepaymentStatusEnum.PAYING,
    );

    return this.scheduleRepository.create(schedule);
  }
}

