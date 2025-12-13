export interface LoanConfigRepositoryInterface {
  getIndicativeRate(): Promise<number | null>;
  setIndicativeRate(rate: number): Promise<void>;
}

