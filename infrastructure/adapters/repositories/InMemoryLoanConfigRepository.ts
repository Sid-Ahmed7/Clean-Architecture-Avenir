import { LoanConfigRepositoryInterface } from "../../../application/ports/repositories/LoanConfigRepositoryInterface";

export class InMemoryLoanConfigRepository implements LoanConfigRepositoryInterface {
  private indicativeRate: number | null = 0.05;

  public async getIndicativeRate(): Promise<number | null> {
    return this.indicativeRate;
  }

  public async setIndicativeRate(rate: number): Promise<void> {
    this.indicativeRate = rate;
  }
}

