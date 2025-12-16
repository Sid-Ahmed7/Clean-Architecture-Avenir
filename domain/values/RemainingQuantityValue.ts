import { InvalidQuantityError } from "../errors/InvalidQuantityError";

export class RemainingQuantityValue {

    public static from(remainingQuantity: number, initialQuantity?: number) {
        if (remainingQuantity < 0) {
            return new InvalidQuantityError(`Invalid remaining quantity: ${remainingQuantity}. Remaining quantity cannot be negative.`);
        }

        if (!Number.isInteger(remainingQuantity)) {
            return new InvalidQuantityError(`Invalid remaining quantity: ${remainingQuantity}. Remaining quantity must be an integer.`);
        }

        if (initialQuantity !== undefined && remainingQuantity > initialQuantity) {
            return new InvalidQuantityError(`Invalid remaining quantity: ${remainingQuantity}. Cannot exceed initial quantity: ${initialQuantity}.`);
        }

        return new RemainingQuantityValue(remainingQuantity);
    }

    private constructor(public value: number) {}
}
