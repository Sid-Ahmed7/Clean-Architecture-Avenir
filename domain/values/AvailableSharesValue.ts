import { InvalidIPOOperationError } from "../errors/InvalidIPOOperationError";

export class AvailableSharesValue {

    public static from(availableShares: number, totalShares?: number) {
        if (availableShares < 0) {
            return new InvalidIPOOperationError(`Invalid available shares: ${availableShares}. Available shares cannot be negative.`);
        }

        if (!Number.isInteger(availableShares)) {
            return new InvalidIPOOperationError(`Invalid available shares: ${availableShares}. Available shares must be an integer.`);
        }

        if (totalShares !== undefined && availableShares > totalShares) {
            return new InvalidIPOOperationError(`Invalid available shares: ${availableShares}. Cannot exceed total shares: ${totalShares}.`);
        }

        return new AvailableSharesValue(availableShares);
    }

    private constructor(public value: number) {}
}
