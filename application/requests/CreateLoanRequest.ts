export interface CreateLoanRequestInput {
  advisorId: string;
  amount: number;
  purpose: string;
  durationMonths?: number;
}

