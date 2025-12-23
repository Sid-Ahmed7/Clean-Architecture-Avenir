export class InvalidBeneficiaryIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBeneficiaryIdError";
  }
}