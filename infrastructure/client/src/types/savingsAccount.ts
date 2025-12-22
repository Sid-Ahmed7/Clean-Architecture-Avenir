export interface SavingsAccount {
    accountNumber: number;
    productId: string;
    userId: string;
    userName: string;
    interestRate: number;
    maxDepositAmount: number | null;
    totalInterestEarned: number;
    isActive: boolean;
    balance: number;
    lastBalanceUpdate: string; // ISO date string
    lastInterestApplied?: string; // ISO date string
    maturity?: string; // ISO date string
}
