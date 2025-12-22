export class InvalidBeneficiaryGroupIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBeneficiaryGroupIdError";
  }
}