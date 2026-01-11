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
    lastBalanceUpdate: string; 
    lastInterestApplied?: string;
    maturity?: string; 
}
