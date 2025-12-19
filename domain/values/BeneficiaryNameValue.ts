import { InvalidBeneficiaryNameError } from "../errors/InvalidBeneficiaryNameError";

export class BeneficiaryNameValue {


public static from(name: string): BeneficiaryNameValue | InvalidBeneficiaryNameError {
    if (!name || name.trim().length === 0) {
      return new InvalidBeneficiaryNameError("Beneficiary name cannot be empty");
    }

    if (name.length > 50) {
      return new InvalidBeneficiaryNameError("Beneficiary name cannot exceed 100 characters");
    }

    return new BeneficiaryNameValue(name.trim());
  }

  private constructor(public readonly value: string) {}
}