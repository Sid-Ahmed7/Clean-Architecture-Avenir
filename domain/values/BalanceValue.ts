import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class BalanceValue {
    public static from(balance: number) {
        if (isNaN(balance) || balance < 0) {
            return new InvalidBalanceError(`Invalid balance amount: ${balance}`);
        }
        return new BalanceValue(balance);
    }
    private constructor(public value: number) {}
}