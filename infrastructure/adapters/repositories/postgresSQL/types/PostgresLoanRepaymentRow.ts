import {RepaymentStatusEnum} from "./PostgresEnums";

export interface PostgresLoanRepaymentRow {
  id: string;
  loan_request_id: string;
  client_id: string;
  monthly_amount: string; 
  remaining_principal: string; 
  next_due_date: Date;
  duration_months: number;
  payments_made: number;
  status: RepaymentStatusEnum;
  last_failure_reason: string | null;
}