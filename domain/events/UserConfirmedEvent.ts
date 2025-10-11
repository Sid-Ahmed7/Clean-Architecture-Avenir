import { BankUserEntity } from "../entities/BankUserEntity";

export class UserConfirmedEvent {
  public readonly eventName = "UserConfirmedEvent";

  constructor(
    public readonly user: BankUserEntity,
    public readonly occuredAt: Date = new Date()
  ) {}
}
