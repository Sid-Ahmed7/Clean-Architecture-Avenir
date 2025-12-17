import { TransactionTypeEnum, OrderStatusEnum } from "./PostgresEnums";


export interface PostgresTransactionRow {
    transaction_reference: string;
    debit_account: number;
    credit_account: number;
    amount: number;
    transaction_type: TransactionTypeEnum;
    executed_by: string;
    status: OrderStatusEnum;
    description: string | null;
    category: string | null;
    created_at: Date;
    debit_user_id: string | null;
    credit_user_id: string | null;
    debit_user_name: string | null;
    credit_user_name: string | null;
}
