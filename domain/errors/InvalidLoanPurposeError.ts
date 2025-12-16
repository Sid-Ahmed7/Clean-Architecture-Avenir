export class InvalidLoanPurposeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLoanPurposeError";
  }
}

