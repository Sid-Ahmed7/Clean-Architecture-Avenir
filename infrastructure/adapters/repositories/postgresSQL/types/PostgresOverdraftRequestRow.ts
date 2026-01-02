import { OverdraftRequestStatusEnum } from "./PostgresEnums";

export interface PostgresOverdraftRequestRow {
  id: string;
  account_number: string; 
  user_id: string;
  current_overdraft_limit: string;
  requested_overdraft_limit: string;
  status: OverdraftRequestStatusEnum;
  created_at: Date;
}