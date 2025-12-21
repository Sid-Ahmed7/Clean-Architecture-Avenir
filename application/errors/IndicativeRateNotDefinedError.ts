export class IndicativeRateNotDefinedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IndicativeRateNotDefinedError";
  }
}

