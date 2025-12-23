export class UnauthorizedAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedAccessError";
  }
}
