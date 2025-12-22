export class BeneficiaryGroupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeneficiaryGroupNotFoundError";
  }
}

