import { AccountTypeEnum, AccountStatusEnum } from "./PostgresEnums";

export interface PostgresAccountRow {
    account_number: number;
    iban: string;
    user_id: string;
    account_type: AccountTypeEnum;
    current_balance: number;
    currency: string;
    account_status: AccountStatusEnum;
    is_active: boolean;
    withdrawal_limit: number | null;
    transfer_limit: number | null;
    overdraft_limit: number | null;
    created_at: Date;
    custom_account_name: string | null;
    total_transfered: number;
    last_transfer_reset_date: Date;
    parent_account_id: number | null;
    closed_at: Date | null;
    blocked_balanced: number;
}
