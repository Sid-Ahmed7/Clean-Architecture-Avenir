export class UnauthorizedGroupCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedGroupCreationError";
  }
}

