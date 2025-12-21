import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class OverdraftLimitValue {

    public static from(limit?: number) {
        if (limit === undefined || limit === null || Number.isNaN(limit)) {
            return new InvalidBalanceError("Overdraft limit is required");
        }

        if (limit < 0) {
            return new InvalidBalanceError(`Invalid overdraft limit: ${limit}. Overdraft limit cannot be negative.`);
        }

        return new OverdraftLimitValue(limit);
    }

    private constructor(public value: number) {}
}
