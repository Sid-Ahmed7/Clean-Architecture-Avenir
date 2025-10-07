import { InvalidTransactionAmountError } from "../errors/InvalidTransactionAmountError";

export class TransactionAmountValue {
    public static from(amount: number) {

        if(typeof amount !== "number" || isNaN(amount) || amount < 0) {
            return new InvalidTransactionAmountError(`Invalid transaction amount: ${amount}. Amount must be a number greater than or equal to 0`);
        }
        return new TransactionAmountValue(amount);
    }
    private constructor(public value: number) {}



}