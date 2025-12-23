export class LoanNotValidatedByAdvisorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoanNotValidatedByAdvisorError";
  }
}

