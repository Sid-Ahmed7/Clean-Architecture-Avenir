export interface InterestSummary {
    accountNumber: number;
    currentBalance: number;
    interestRate: number;
    maxDepositAmount: number | null;
    totalInterestEarned: number;
    pendingInterest: number; 
    lastInterestApplied?: Date;
    projectedAnnualInterest: number;
    isActive: boolean;
}
