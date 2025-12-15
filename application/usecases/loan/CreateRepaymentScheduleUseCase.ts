import { LoanRepaymentScheduleRepositoryInterface } from "../../ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { LoanRepaymentEntity } from "../../../domain/entities/LoanRepaymentEntity";
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
    const id = this.uuidService.generate();
    const nextDueDate = new Date();
    nextDueDate.setMinutes(nextDueDate.getMinutes() + 1);

    const schedule = LoanRepaymentEntity.create(
      id,
      loanRequestId,
      clientId,
      monthlyAmount,
      remainingPrincipal,
      nextDueDate,
      durationMonths,
    );
    if (schedule instanceof Error) {
      return schedule;
    }

    const createdSchedule = await this.scheduleRepository.create(schedule);
    if (createdSchedule instanceof Error) {
      return createdSchedule;
    }

    return createdSchedule;
  }
}

