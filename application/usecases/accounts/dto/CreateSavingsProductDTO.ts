export interface CreateSavingsProductDTO {
    name: string;
    description: string;
    interestRate: number;
    maxDepositAmount?: number | null;
    minDepositAmount?: number | null;
}
