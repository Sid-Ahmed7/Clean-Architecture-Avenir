import { InvalidLoanPurposeError } from "../errors/InvalidLoanPurposeError";

export class LoanPurposeValue {
  public static from(purpose: string): LoanPurposeValue | InvalidLoanPurposeError {
    if (typeof purpose !== "string" || !purpose.trim()) {
      return new InvalidLoanPurposeError("Purpose is required");
    }
    return new LoanPurposeValue(purpose.trim());
  }

  private constructor(public readonly value: string) {}
}

