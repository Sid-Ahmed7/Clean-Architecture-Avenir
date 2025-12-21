export class BeneficiaryAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeneficiaryAlreadyExistsError";
  }
}

