
export interface PostgresSavingsAccountRow {
    account_number: string;
    product_id: string;
    user_id: string;
    interest_rate: string;
    max_deposit_amount: string | null;
    total_interest_earned: string;
    is_active: boolean;
    balance: string;
    last_balance_update: Date;
    last_interest_applied: Date | null;
    maturity: Date | null;
    created_at: Date;
}
