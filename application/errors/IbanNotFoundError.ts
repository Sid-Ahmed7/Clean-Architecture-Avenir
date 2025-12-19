export class IbanNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IbanNotFoundError";
  }
}

