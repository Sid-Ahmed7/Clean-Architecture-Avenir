export class InvalidLoanAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLoanAmountError";
  }
}

