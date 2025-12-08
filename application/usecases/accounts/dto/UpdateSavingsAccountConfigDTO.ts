export interface UpdateSavingsAccountConfigDTO {
    accountNumber: number;
    interestRate?: number;
    maxDepositAmount?: number | null;
    isActive?: boolean;
}
