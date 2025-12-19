export class InvalidBeneficiaryNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBeneficiaryNameError";
  }
}