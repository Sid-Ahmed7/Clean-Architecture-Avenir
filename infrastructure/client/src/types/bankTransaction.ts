export interface BankTransaction {
    transactionReference: string;
    debitAccount: number;
    creditAccount: number;
    amount: number;
    transactionType: string;
    createdAt: string;
    debitUserId?: string;
    creditUserId?: string;
    debitUserName?: string;
    creditUserName?: string;
}
