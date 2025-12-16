import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class BlockedBalanceValue {
    public static from(blockedBalance: number): BlockedBalanceValue | InvalidBalanceError {
        if (isNaN(blockedBalance) || blockedBalance < 0) {
            return new InvalidBalanceError(`Invalid blocked balance amount: ${blockedBalance}`);
        }
        return new BlockedBalanceValue(blockedBalance);
    }
    private constructor(public readonly value: number) {}
}
