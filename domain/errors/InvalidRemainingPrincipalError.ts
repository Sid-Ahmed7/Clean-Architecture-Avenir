export class InvalidRemainingPrincipalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRemainingPrincipalError";
  }
}

