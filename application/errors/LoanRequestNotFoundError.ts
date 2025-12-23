export class LoanRequestNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoanRequestNotFoundError";
  }
}

