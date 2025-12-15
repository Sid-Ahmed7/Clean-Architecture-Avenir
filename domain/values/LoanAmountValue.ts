export class LoanAmountValue {
  public static from(amount: number): LoanAmountValue | Error {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new Error("Invalid loan amount");
    }
    return new LoanAmountValue(amount);
  }

  private constructor(public readonly value: number) {}
}


