import { LoanStatusEnum } from "../enums/LoanStatusEnum";
import { UserIdValue } from "../values/UserIdValue";

export class LoanRequestEntity {
  public static create(
    id: string,
    clientId: string,
    advisorId: string,
    amount: number,
    purpose: string,
    durationMonths: number = 12,
    advisorName?: string,
    directorName?: string,
  ) {
    const validatedClient = UserIdValue.from(clientId);
    if (validatedClient instanceof Error) {
      return validatedClient;
    }

    const validatedAdvisor = UserIdValue.from(advisorId);
    if (validatedAdvisor instanceof Error) {
      return validatedAdvisor;
    }

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new Error("Invalid loan amount");
    }

    if (!purpose || purpose.trim().length === 0) {
      return new Error("Purpose is required");
    }

    return new LoanRequestEntity(
      id,
      validatedClient.value,
      validatedAdvisor.value,
      amount,
      purpose.trim(),
      LoanStatusEnum.PENDING,
      new Date(),
      undefined,
      undefined,
      durationMonths,
      undefined,
      undefined,
      advisorName,
      directorName,
    );
  }

  private constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly advisorId: string,
    public readonly amount: number,
    public readonly purpose: string,
    public status: LoanStatusEnum,
    public readonly createdAt: Date,
    public proposedRate?: number,
    public clientDecision?: "ACCEPTED" | "REJECTED",
    public durationMonths: number = 12,
    public appliedRate?: number,
    public monthlyPayment?: number,
    public advisorName?: string,
    public directorName?: string,
  ) {}

  public updateStatus(status: LoanStatusEnum) {
    this.status = status;
  }

  public proposeRate(rate: number) {
    this.proposedRate = rate;
    this.status = LoanStatusEnum.RATE_PROPOSED;
  }

  public applyClientDecision(accept: boolean) {
    this.clientDecision = accept ? "ACCEPTED" : "REJECTED";
    this.status = accept ? LoanStatusEnum.DIRECTOR_APPROVED : LoanStatusEnum.CLIENT_REJECTED;
  }

  public applyRate(rate: number) {
    this.appliedRate = rate;
    const total = this.amount * (1 + rate * (this.durationMonths / 12));
    this.monthlyPayment = Number((total / this.durationMonths).toFixed(2));
  }

  public setDirectorName(name: string) {
    this.directorName = name;
  }
}

