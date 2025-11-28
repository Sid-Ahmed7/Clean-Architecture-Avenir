export class InvalidCancelledOrder extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCancelledOrder";
  }
}
