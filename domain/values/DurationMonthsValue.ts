import { InvalidDurationMonthsError } from "../errors/InvalidDurationMonthsError";

export class DurationMonthsValue {
  public static from(months: number): DurationMonthsValue | InvalidDurationMonthsError {
    if (typeof months !== "number" || Number.isNaN(months) || months <= 0 || !Number.isInteger(months)) {
      return new InvalidDurationMonthsError("Invalid duration months");
    }
    return new DurationMonthsValue(months);
  }

  private constructor(public readonly value: number) {}
}


