import { InvalidLoanAmountError } from "../errors/InvalidLoanAmountError";

export class LoanAmountValue {
  public static from(amount: number): LoanAmountValue | InvalidLoanAmountError {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new InvalidLoanAmountError("Invalid loan amount");
    }
    return new LoanAmountValue(amount);
  }

  private constructor(public readonly value: number) {}
}


