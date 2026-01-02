import { LoanStatusEnum } from "./PostgresEnums";

export interface PostgresLoanRequestRow {
  id: string;
  client_id: string;
  advisor_id: string;
  amount: string; 
  purpose: string;
  status: LoanStatusEnum;
  created_at: Date;
  proposed_rate: string | null; 
  applied_rate: string | null; 
  monthly_payment: string | null;
  client_decision: 'ACCEPTED' | 'REJECTED' | null;
  duration_months: number;
  advisor_name: string | null;
  director_name: string | null;
  client_name: string | null;
}