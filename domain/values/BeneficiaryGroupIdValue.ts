import { InvalidBeneficiaryGroupIdError } from "../errors/InvalidBeneficiaryGroupIdError";

export class BeneficiaryGroupIdValue {
  public static from(beneficiaryId: string): BeneficiaryGroupIdValue | InvalidBeneficiaryGroupIdError {
    if (!beneficiaryId || beneficiaryId.trim().length === 0) {
      return new InvalidBeneficiaryGroupIdError("Group Beneficiary ID cannot be empty");
    }

    return new BeneficiaryGroupIdValue(beneficiaryId.trim());
  }

  private constructor(public readonly value: string) {}
}