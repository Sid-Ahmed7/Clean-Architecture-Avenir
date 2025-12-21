export class InvalidGroupNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidGroupNameError";
  }
}