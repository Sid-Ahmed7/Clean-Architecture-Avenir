import { AccountTypeEnum } from "../../domain/enums/AccountTypeEnum";
import { UserConfirmedEvent } from "../ports/event/UserConfirmedEvent";
import { CreateAccountUseCase } from "../usecases/accounts/CreateAccountUseCase";

export class UserConfirmedEventHandler {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handler(event: UserConfirmedEvent) {
    const user = event.user;

    const accountDTO = {
      userId: user.id,
      accountType: AccountTypeEnum.CHECKING,
      currency: "EUR",
      customAccountName: `${user.firstName} - ${user.lastName}`,
      createdBy: user.id
    };

    const createdAccount = await this.createAccountUseCase.execute(accountDTO);

    if (createdAccount instanceof Error) {
      return createdAccount;
    }

    return createdAccount;
  }
}
