export interface CreateSavingsProduct {
    name: string;
    description: string;
    interestRate: number;
    maxDepositAmount?: number | null;
    minDepositAmount?: number | null;
}
