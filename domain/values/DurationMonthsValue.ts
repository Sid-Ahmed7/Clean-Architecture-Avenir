export class DurationMonthsValue {
  public static from(months: number): DurationMonthsValue | Error {
    if (typeof months !== "number" || Number.isNaN(months) || months <= 0 || !Number.isInteger(months)) {
      return new Error("Invalid duration months");
    }
    return new DurationMonthsValue(months);
  }

  private constructor(public readonly value: number) {}
}


