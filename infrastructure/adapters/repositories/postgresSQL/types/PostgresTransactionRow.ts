import { TransactionTypeEnum, TransferStatusEnum } from "./PostgresEnums";


export interface PostgresTransactionRow {
    transaction_reference: string;
    debit_account: string;
    credit_account: string;
    amount: string;
    transaction_type: TransactionTypeEnum;
    executed_by: string;
    status: TransferStatusEnum;
    description: string | null;
    category: string | null;
    created_at: Date;
    debit_user_id: string | null;
    credit_user_id: string | null;
    debit_user_name: string | null;
    credit_user_name: string | null;
}
