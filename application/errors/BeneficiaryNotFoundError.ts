export class BeneficiaryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeneficiaryNotFoundError";
  }
}

