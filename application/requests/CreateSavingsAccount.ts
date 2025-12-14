export interface CreateSavingsAccount {
    accountNumber: number;
    productId: string;
    userId: string;
    interestRate: number;
    maxDepositAmount?: number | null;
    maturity?: Date;
}
