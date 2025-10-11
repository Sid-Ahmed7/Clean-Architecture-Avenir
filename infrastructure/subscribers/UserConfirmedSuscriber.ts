import { EventBusInterface } from "../../application/ports/event/EventBusInterface";
import { CreateAccountUseCase } from "../../application/usecases/accounts/CreateAccountUseCase";
import { UserConfirmedEventHandler } from "../../application/handlers/UserConfirmedEventHandler";
import { GenerateAccountNumberService } from "../adapters/services/GenerateAccountNumberService";
import { GenerateIbanService } from "../adapters/services/GenerateIbanService";
import { UserConfirmedEvent } from "../../domain/events/UserConfirmedEvent";
import { AccountRepositoryInterface } from "../../application/ports/repositories/AccountRepositoryInterface";

export function registerUserConfirmedSubscriber(
  eventBus: EventBusInterface,
  accountRepository: AccountRepositoryInterface
) {
  const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
  const ibanGenerator = new GenerateIbanService(accountRepository);

  const createAccountUseCase = new CreateAccountUseCase(
    accountRepository,
    accountNumberGenerator,
    ibanGenerator
  );

  const handler = new UserConfirmedEventHandler(createAccountUseCase);

  eventBus.subscribe<UserConfirmedEvent>("UserConfirmedEvent", async (eventData) => {
    await handler.handler(eventData);
  });

  console.log("Subscribed to UserConfirmedEvent");
}
