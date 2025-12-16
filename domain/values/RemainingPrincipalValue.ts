import { InvalidRemainingPrincipalError } from "../errors/InvalidRemainingPrincipalError";

export class RemainingPrincipalValue {
  public static from(amount: number): RemainingPrincipalValue | InvalidRemainingPrincipalError {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return new InvalidRemainingPrincipalError("Invalid remaining principal");
    }
    return new RemainingPrincipalValue(amount);
  }

  private constructor(public readonly value: number) {}
}


