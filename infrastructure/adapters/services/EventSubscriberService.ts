import { EventBusInterface } from "../../../application/ports/event/EventBusInterface";
import { AccountRepositoryInterface } from "../../../application/ports/repositories/AccountRepositoryInterface";
import { CreateAccountUseCase } from "../../../application/usecases/accounts/CreateAccountUseCase";
import { UserConfirmedEventHandler } from "../../../application/handlers/UserConfirmedEventHandler";
import { GenerateAccountNumberService } from "./GenerateAccountNumberService";
import { GenerateIbanService } from "./GenerateIbanService";
import { UserConfirmedEvent } from "../../../application/ports/event/UserConfirmedEvent";
import { SendNotificationToClientUseCase } from "../../../application/usecases/notification/SendNotificationToClientUseCase";
import { NotificationRepositoryInterface } from "../../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationService } from "./notification/NotificationService";
import { CryptoUuidGenerator } from "./CryptoUuidGenerator";
import { UserRepositoryInterface } from "../../../application/ports/repositories/auth/UserRepositoryInterface";

export class EventSubscriberService {
  constructor(
    private readonly accountNumberGenerator: GenerateAccountNumberService,
    private readonly ibanGenerator: GenerateIbanService,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationPublisher: NotificationService,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public registerUserConfirmedSubscriber(
    eventBus: EventBusInterface,
    accountRepository: AccountRepositoryInterface
  ): void {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationPublisher,
      this.uuidService,
      this.userRepository
    );

    const createAccountUseCase = new CreateAccountUseCase(
      accountRepository,
      this.accountNumberGenerator,
      this.ibanGenerator,
      sendNotificationUseCase
    );

    const handler = new UserConfirmedEventHandler(createAccountUseCase);

    eventBus.subscribe<UserConfirmedEvent>("UserConfirmedEvent", async (eventData) => {
      await handler.handler(eventData);
    });

    console.log("Subscribed to UserConfirmedEvent");
  }
}
