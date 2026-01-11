import { AccountNumberValue } from "../values/AccountNumberValue";
import { InterestRateValue } from "../values/InterestRateValue";
import { MaxDepositAmountValue } from "../values/MaxDepositAmountValue";

export class SavingsAccountsEntity {

    public static from(
        accountNumber: number,
        productId: string,
        userId: string,
        interestRate: number, 
        maxDepositAmount?: number | null,
        totalInterestEarned: number = 0,
        isActive: boolean = true,
        balance: number = 0,
        lastBalanceUpdate?: Date,
        lastInterestApplied?: Date, 
        maturity?: Date
    ) {

        const validatedAccountNumber = AccountNumberValue.from(accountNumber);
        if(validatedAccountNumber instanceof Error) {
            return validatedAccountNumber;
        }

        const validatedRate = InterestRateValue.from(interestRate);
        if(validatedRate instanceof Error) {
            return validatedRate;
        }

        const validatedMaxDeposit = MaxDepositAmountValue.from(maxDepositAmount);
        if(validatedMaxDeposit instanceof Error) {
            return validatedMaxDeposit;
        }

        return new SavingsAccountsEntity(
            validatedAccountNumber.value,
            productId,
            userId,
            validatedRate.value, 
            validatedMaxDeposit.value,
            totalInterestEarned,
            isActive,
            balance,
            lastBalanceUpdate || new Date(),
            lastInterestApplied, 
            maturity
        );
    }

    private constructor(
        public accountNumber: number,
        public productId: string,
        public userId: string,
        public interestRate: number,
        public maxDepositAmount: number | null,
        public totalInterestEarned: number,
        public isActive: boolean,
        public balance: number,
        public lastBalanceUpdate: Date,
        public lastInterestApplied?: Date,
        public maturity?: Date
    ) {}

    public calculateDailyInterest(currentBalance: number): number {
        if (!this.isActive || currentBalance <= 0) {
            return 0;
        }

        const effectiveBalance = this.maxDepositAmount !== null 
            ? Math.min(currentBalance, this.maxDepositAmount)
            : currentBalance;

        // Calculate per minute instead of per day (525600 = 365*24*60)
        const minuteInterest = (effectiveBalance * this.interestRate) / 525600 / 100;
        
        // Round to 2 decimal places
        return Math.round(minuteInterest * 100) / 100;
    }


    public creditInterest(interestAmount: number): void {
        this.totalInterestEarned += interestAmount;
        this.lastInterestApplied = new Date();
    }


    public updateInterestRate(newRate: number): Error | void {
        const validatedRate = InterestRateValue.from(newRate);
        if(validatedRate instanceof Error) {
            return validatedRate;
        }
        this.interestRate = validatedRate.value;
    }

  
    public updateMaxDeposit(newMaxDeposit: number | null): Error | void {
        const validatedMaxDeposit = MaxDepositAmountValue.from(newMaxDeposit);
        if(validatedMaxDeposit instanceof Error) {
            return validatedMaxDeposit;
        }
        this.maxDepositAmount = validatedMaxDeposit.value;
    }

  
    public activateInterest(): void {
        this.isActive = true;
    }

 
    public deactivateInterest(): void {
        this.isActive = false;
    }

    public getProjectedAnnualInterest(currentBalance: number): number {
        const dailyInterest = this.calculateDailyInterest(currentBalance);
        return Math.round(dailyInterest * 365 * 100) / 100;
    }
}