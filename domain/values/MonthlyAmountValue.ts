import { InvalidMonthlyAmountError } from "../errors/InvalidMonthlyAmountError";

export class MonthlyAmountValue {
  public static from(amount: number): MonthlyAmountValue | InvalidMonthlyAmountError {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new InvalidMonthlyAmountError("Invalid monthly amount");
    }
    return new MonthlyAmountValue(amount);
  }

  private constructor(public readonly value: number) {}
}


