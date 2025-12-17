
export interface PostgresSavingsAccountRow {
    account_number: number;
    product_id: string;
    user_id: string;
    interest_rate: number;
    max_deposit_amount: number | null;
    total_interest_earned: number;
    is_active: boolean;
    balance: number;
    last_balance_update: Date;
    last_interest_applied: Date | null;
    maturity: Date | null;
    created_at: Date;
}
