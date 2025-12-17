export interface LoanConfigService {
  getIndicativeRate(): Promise<number | null>;
  setIndicativeRate(rate: number): Promise<void>;
}


