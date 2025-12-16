import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class TransferLimitValue {

    public static from(limit: number) {
        if (limit <= 0) {
            return new InvalidBalanceError(`Invalid transfer limit: ${limit}. Transfer limit must be positive.`);
        }

        return new TransferLimitValue(limit);
    }

    private constructor(public value: number) {}
}
