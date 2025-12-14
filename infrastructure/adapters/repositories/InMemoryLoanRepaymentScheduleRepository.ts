import { LoanRepaymentScheduleRepositoryInterface } from "../../../application/ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { LoanRepaymentEntity } from "../../../domain/entities/LoanRepaymentEntity";

export class InMemoryLoanRepaymentScheduleRepository implements LoanRepaymentScheduleRepositoryInterface {
  private schedules: LoanRepaymentEntity[] = [];

  public async create(schedule: LoanRepaymentEntity) {
    this.schedules.push(schedule);
    return schedule;
  }

  public async findActiveByClient(clientId: string) {
    return this.schedules.filter((s) => s.clientId === clientId && s.status === "PAYING");
  }

  public async findByLoanRequest(loanRequestId: string) {
    return this.schedules.find((s) => s.loanRequestId === loanRequestId) ?? null;
  }

  public async save(schedule: LoanRepaymentEntity) {
    const idx = this.schedules.findIndex((s) => s.id === schedule.id);
    if (idx === -1) {
      this.schedules.push(schedule);
    } else {
      this.schedules[idx] = schedule;
    }
    return schedule;
  }

  public async findDue(referenceDate: Date) {
    return this.schedules.filter(
      (s) => s.status === "PAYING" && s.nextDueDate.getTime() <= referenceDate.getTime(),
    );
  }
}

