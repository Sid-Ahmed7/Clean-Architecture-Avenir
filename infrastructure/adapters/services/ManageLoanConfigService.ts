import { LoanConfigService } from "../../../application/ports/services/LoanConfigService";

export class ManageLoanConfigService implements LoanConfigService {
  private indicativeRate: number | null = 0.05;

  public async getIndicativeRate(): Promise<number | null> {
    return this.indicativeRate;
  }

  public async setIndicativeRate(rate: number): Promise<void> {
    this.indicativeRate = rate;
  }
}


