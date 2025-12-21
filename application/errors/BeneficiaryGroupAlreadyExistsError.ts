export class BeneficiaryGroupAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeneficiaryGroupAlreadyExistsError";
  }
}

