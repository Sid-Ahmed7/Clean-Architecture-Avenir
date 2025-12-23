export class RateProposalNotRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateProposalNotRequiredError";
  }
}

