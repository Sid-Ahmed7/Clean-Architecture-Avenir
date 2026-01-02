
export interface PostgresSavingsProductRow {
    id: string;
    name: string;
    description: string;
    interest_rate: number;
    max_deposit_amount: number | null;
    min_deposit_amount: number | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
