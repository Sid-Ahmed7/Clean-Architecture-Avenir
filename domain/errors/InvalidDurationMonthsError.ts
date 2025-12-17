export class InvalidDurationMonthsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDurationMonthsError";
  }
}

