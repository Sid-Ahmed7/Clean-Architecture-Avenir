export interface UpdateSavingsAccountConfig {
    accountNumber: number;
    interestRate?: number;
    maxDepositAmount?: number | null;
    isActive?: boolean;
}
