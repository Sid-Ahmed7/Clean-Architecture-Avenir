import { AccountTypeEnum, AccountStatusEnum } from "./PostgresEnums";

export interface PostgresAccountRow {
    account_number: string;
    iban: string;
    user_id: string;
    account_type: AccountTypeEnum;
    current_balance: string;
    currency: string;
    account_status: AccountStatusEnum;
    is_active: boolean;
    withdrawal_limit: string | null;
    transfer_limit: string | null;
    overdraft_limit: string | null;
    created_at: Date;
    custom_account_name: string | null;
    total_transfered: string;
    last_transfer_reset_date: Date;
    parent_account_id: string | null;
    closed_at: Date | null;
    blocked_balanced: string;
}
