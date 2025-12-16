import { InvalidTotalSharesError } from "../errors/InvalidTotalSharesError";

export class TotalSharesValue {

    public static from(totalShares: number) {
        if (totalShares < 0) {
            return new InvalidTotalSharesError(`Invalid total shares: ${totalShares}. Total shares cannot be negative.`);
        }

        if (!Number.isInteger(totalShares)) {
            return new InvalidTotalSharesError(`Invalid total shares: ${totalShares}. Total shares must be an integer.`);
        }

        return new TotalSharesValue(totalShares);
    }

    private constructor(public value: number) {}
}
