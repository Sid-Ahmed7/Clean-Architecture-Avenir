import { InvalidBeneficiaryIdError } from "../errors/InvalidBeneficiaryIdError";

export class BeneficiaryIdValue {
  public static from(beneficiaryId: string): BeneficiaryIdValue | InvalidBeneficiaryIdError {
    if (!beneficiaryId || beneficiaryId.trim().length === 0) {
      return new InvalidBeneficiaryIdError("Beneficiary ID cannot be empty");
    }

    return new BeneficiaryIdValue(beneficiaryId.trim());
  }

  private constructor(public readonly value: string) {}
}