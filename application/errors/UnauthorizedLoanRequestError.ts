export class UnauthorizedLoanRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedLoanRequestError";
  }
}

