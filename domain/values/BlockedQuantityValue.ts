import { InvalidQuantityError } from "../errors/InvalidQuantityError";

export class BlockedQuantityValue {
    public static from(blockedQuantity: number): BlockedQuantityValue | InvalidQuantityError {
        if (isNaN(blockedQuantity) || blockedQuantity < 0) {
            return new InvalidQuantityError(`Invalid blocked quantity: ${blockedQuantity}`);
        }
        return new BlockedQuantityValue(blockedQuantity);
    }
    private constructor(public readonly value: number) {}
}
