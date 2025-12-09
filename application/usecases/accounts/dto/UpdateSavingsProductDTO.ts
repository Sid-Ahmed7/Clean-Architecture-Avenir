export interface UpdateSavingsProductDTO {
    productId: string;
    interestRate?: number;
    maxDepositAmount?: number | null;
    minDepositAmount?: number | null;
    isActive?: boolean;
}
