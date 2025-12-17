export class ActiveLoanRequestExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActiveLoanRequestExistsError";
  }
}

