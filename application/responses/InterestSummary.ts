export interface InterestSummary {
    accountNumber: number;
    currentBalance: number;
    interestRate: number;
    maxDepositAmount: number | null;
    totalInterestEarned: number;
    lastInterestApplied?: Date;
    projectedAnnualInterest: number;
    isActive: boolean;
}
