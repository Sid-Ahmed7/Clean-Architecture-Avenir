import { EventBusInterface } from "../../application/ports/event/EventBusInterface";
import { CreateAccountUseCase } from "../../application/usecases/accounts/CreateAccountUseCase";
import { UserConfirmedEventHandler } from "../../application/handlers/UserConfirmedEventHandler";
import { GenerateAccountNumberService } from "../adapters/services/GenerateAccountNumberService";
import { GenerateIbanService } from "../adapters/services/GenerateIbanService";
import { UserConfirmedEvent } from "../../application/ports/event/UserConfirmedEvent";
import { AccountRepositoryInterface } from "../../application/ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../../application/usecases/notification/SendNotificationToClientUseCase";
import { NotificationRepositoryInterface } from "../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { InMemoryNotificationRepository } from "../adapters/repositories/InMemoryNotificationRepository";
import { NotificationPublisher } from "../../application/ports/services/notification/NotificationPublisher";
import { NotificationService } from "../adapters/services/notification/NotificationService";
import { CryptoUuidGenerator } from "../adapters/services/CryptoUuidGenerator";
import { UserRepositoryInterface } from "../../application/ports/repositories/auth/UserRepositoryInterface";
import { InMemoryUserRepository } from "../adapters/repositories/InMemoryUserRepository";
import { PasswordEncryptionService } from "../adapters/services/auth/PasswordEncryptionService";

export function registerUserConfirmedSubscriber(
  eventBus: EventBusInterface,
  accountRepository: AccountRepositoryInterface
) {
  const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
  const ibanGenerator = new GenerateIbanService(accountRepository);
  const notificationRepository: NotificationRepositoryInterface = new InMemoryNotificationRepository();
  const notificationPublisher: NotificationService = new NotificationService();
  const uuidService: CryptoUuidGenerator = new CryptoUuidGenerator();
  const passwordService: PasswordEncryptionService = new PasswordEncryptionService();
  const userRepository: UserRepositoryInterface = new InMemoryUserRepository(passwordService);
  const sendNotificationUseCase = new SendNotificationToClientUseCase(notificationRepository, notificationPublisher,uuidService,userRepository);

  const createAccountUseCase = new CreateAccountUseCase(
    accountRepository,
    accountNumberGenerator,
    ibanGenerator,
    sendNotificationUseCase
  );

  const handler = new UserConfirmedEventHandler(createAccountUseCase);

  eventBus.subscribe<UserConfirmedEvent>("UserConfirmedEvent", async (eventData) => {
    await handler.handler(eventData);
  });

  console.log("Subscribed to UserConfirmedEvent");
}
