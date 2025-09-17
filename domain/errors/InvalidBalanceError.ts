export class InvalidBalance extends Error {
  constructor(amount: number) {
    super(`Invalid balance amount: ${amount}`);
    this.name = "InvalidBalance";
  }
}
