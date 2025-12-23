export class InvalidMonthlyAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMonthlyAmountError";
  }
}

