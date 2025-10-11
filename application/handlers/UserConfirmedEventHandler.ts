import { AccountTypeEnum } from "../../domain/enums/AccountTypeEnum";
import { UserConfirmedEvent } from "../../domain/events/UserConfirmedEvent";
import { CreateAccountUseCase } from "../usecases/accounts/CreateAccountUseCase";

export class UserConfirmedEventHandler {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handler(event: UserConfirmedEvent) {
    const user = event.user;

    console.log("[Handler] Création de compte pour :", user.email);

    const accountDTO = {
      userId: user.id,
      accountType: AccountTypeEnum.CHECKING,
      currency: "EUR",
      customAccountName: `${user.firstName} - ${user.lastName}`,
      createdBy: user.id
    };

    const createdAccount = await this.createAccountUseCase.execute(accountDTO);

    if (createdAccount instanceof Error) {
      console.error("[Handler] Erreur lors de la création du compte :", createdAccount.message);
      return createdAccount;
    }

    console.log("[Handler] Compte créé avec succès :", createdAccount);

    return createdAccount;
  }
}
