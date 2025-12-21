import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class WithdrawalLimitValue {

    public static from(limit: number) {
        if (limit <= 0) {
            return new InvalidBalanceError(`Invalid withdrawal limit: ${limit}. Withdrawal limit must be positive.`);
        }

        return new WithdrawalLimitValue(limit);
    }

    private constructor(public value: number) {}
}
