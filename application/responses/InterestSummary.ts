export interface InterestSummary {
    accountNumber: number;
    currentBalance: number;
    interestRate: number;
    maxDepositAmount: number | null;
    totalInterestEarned: number;
    pendingInterest: number; // Interest calculated but not yet credited
    lastInterestApplied?: Date;
    projectedAnnualInterest: number;
    isActive: boolean;
}
