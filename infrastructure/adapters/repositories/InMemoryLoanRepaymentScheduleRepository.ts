import { LoanRepaymentScheduleRepositoryInterface } from "../../../application/ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { LoanRepaymentSchedule } from "../../../domain/entities/LoanRepaymentSchedule";

export class InMemoryLoanRepaymentScheduleRepository implements LoanRepaymentScheduleRepositoryInterface {
  private schedules: LoanRepaymentSchedule[] = [];

  public async create(schedule: LoanRepaymentSchedule) {
    this.schedules.push(schedule);
    return schedule;
  }

  public async findActiveByClient(clientId: string) {
    return this.schedules.filter((s) => s.clientId === clientId && s.status === "PAYING");
  }

  public async findByLoanRequest(loanRequestId: string) {
    return this.schedules.find((s) => s.loanRequestId === loanRequestId) ?? null;
  }

  public async save(schedule: LoanRepaymentSchedule) {
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

