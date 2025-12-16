export class RateProposalRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateProposalRequiredError";
  }
}

