import { IPOTypeEnum } from "./PostgresEnums";


export interface PostgresStockRow {
    id: string;
    symbol: string;
    company_name: string;
    name: string;
    current_price: string;
    rate_of_change: string;
    currency: string;
    created_at: Date;
    is_action_available: boolean;
    updated_at: Date;
    total_shares: string;
    previous_price: string | null;
    ipo_active: boolean;
    available_shares_for_ipo: string;
    ipo_type: IPOTypeEnum | null;
}
