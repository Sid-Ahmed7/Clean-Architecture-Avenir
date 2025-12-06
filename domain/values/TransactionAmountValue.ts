import { InvalidTransactionAmountError } from "../errors/InvalidTransactionAmountError";

export class TransactionAmountValue {
  public static from(amount: number) {
    if (typeof amount !== "number") {
      return new InvalidTransactionAmountError(`Invalid transaction amount type: expected number, received ${typeof amount}`);
    }

    if (isNaN(amount)) {
      return new InvalidTransactionAmountError(`Invalid transaction amount: NaN is not a valid amount`);
    }

    if (amount < 0) {
      return new InvalidTransactionAmountError(`Invalid transaction amount: ${amount}. Amount must be greater than or equal to 0`);
    }

    return new TransactionAmountValue(amount);
  }

  private constructor(public value: number) {}
}