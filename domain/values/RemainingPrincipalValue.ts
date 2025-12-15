export class RemainingPrincipalValue {
  public static from(amount: number): RemainingPrincipalValue | Error {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new Error("Invalid remaining principal");
    }
    return new RemainingPrincipalValue(amount);
  }

  private constructor(public readonly value: number) {}
}


