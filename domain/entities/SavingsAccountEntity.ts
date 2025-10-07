import { AccountNumberValue } from "../values/AccountNumberValue";
import { InterestRateValue } from "../values/InterestRateValue";

export class SavingsAccountsEntity {

    public static from(accountNumber: number, interestRate: number, lastInterestApplied?: Date, maturity?: Date) {

        const validatedAccountNumber = AccountNumberValue.from(accountNumber);
        if(validatedAccountNumber instanceof Error) {
            return validatedAccountNumber;
        }

        const validatedRate = InterestRateValue.from(interestRate);
        if(validatedRate instanceof Error) {
            return validatedRate;
        }

        return new SavingsAccountsEntity(validatedAccountNumber.value, validatedRate.value, lastInterestApplied, maturity);
    }

    private constructor(
        public accountNumber: number,
        public interestRate: number,
        public lastInterestApplied?: Date,
        public maturity?: Date
    ) {}
}