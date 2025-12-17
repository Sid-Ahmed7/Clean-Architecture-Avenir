import { IPOTypeEnum } from "./PostgresEnums";


export interface PostgresStockRow {
    id: string;
    symbol: string;
    company_name: string;
    name: string;
    current_price: number;
    rate_of_change: number;
    currency: string;
    created_at: Date;
    is_action_available: boolean;
    updated_at: Date;
    total_shares: number;
    previous_price: number | null;
    ipo_active: boolean;
    available_shares_for_ipo: number;
    ipo_type: IPOTypeEnum | null;
}
