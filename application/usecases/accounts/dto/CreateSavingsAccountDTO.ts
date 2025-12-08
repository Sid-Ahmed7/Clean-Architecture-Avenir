export interface CreateSavingsAccountDTO {
    accountNumber: number;
    interestRate: number;
    maxDepositAmount?: number | null;
    maturity?: Date;
}
