import type { UserRepositoryInterface } from '#application/ports/repositories/auth/UserRepositoryInterface.js'
import type { RoleRepositoryInterface } from '#application/ports/repositories/auth/RoleRepositoryInterface.js'
import type { UserRoleRepositoryInterface } from '#application/ports/repositories/auth/UserRoleRepositoryInterface.js'
import type { AccountRepositoryInterface } from '#application/ports/repositories/AccountRepositoryInterface.js'
import type { TransactionRepositoryInterface } from '#application/ports/repositories/TransactionRepositoryInterface.js'
import type { BeneficiaryRepositoryInterface } from '#application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface.js'
import type { BeneficiaryGroupRepositoryInterface } from '#application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface.js'
import type { NotificationRepositoryInterface } from '#application/ports/repositories/notification/NotificationRepositoryInterface.js'
import type { LoanRequestRepositoryInterface } from '#application/ports/repositories/LoanRequestRepositoryInterface.js'
import type { LoanRepaymentScheduleRepositoryInterface } from '#application/ports/repositories/LoanRepaymentScheduleRepositoryInterface.js'
import type { OverdraftRequestRepositoryInterface } from '#application/ports/repositories/OverdraftRequestRepositoryInterface.js'
import type { SavingsAccountRepositoryInterface } from '#application/ports/repositories/SavingsAccountRepositoryInterface.js'
import type { SavingsProductRepositoryInterface } from '#application/ports/repositories/SavingsProductRepositoryInterface.js'
import type { ConversationRepositoryInterface } from '#application/ports/repositories/chat/ConversationRepositoryInterface.js'
import type { MessageRepositoryInterface } from '#application/ports/repositories/chat/MessageRepositoryInterface.js'
import type { NewsRepositoryInterface } from '#application/ports/repositories/news/NewsRepositoryInterface.js'
import type { MediaRepositoryInterface } from '#application/ports/repositories/news/MediaRepositoryInterface.js'
import type { ContentRepositoryInterface } from '#application/ports/repositories/news/ContentRepositoryInterface.js'
import type { StockRepositoryInterface } from '#application/ports/repositories/stocks/StockRepositoryInterface.js'
import type { StockOrderRepositoryInterface } from '#application/ports/repositories/stocks/StockOrderRepositoryInterface.js'
import type { StockHoldingRepositoryInterface } from '#application/ports/repositories/stocks/StockHoldingRepositoryInterface.js'
import type { StockTransactionRepositoryInterface } from '#application/ports/repositories/stocks/StockTransactionRepositoryInterface.js'
import type { EventBusInterface } from '#application/ports/event/EventBusInterface.js'

// Service interfaces
import type { TokenService } from '#application/ports/services/auth/TokenService.js'
import type { PasswordService } from '#application/ports/services/auth/PasswordService.js'
import type { EmailService } from '#application/ports/services/EmailService.js'
import type { EmailComposerService } from '#application/ports/services/EmailComposerService.js'
import type { RegistrationTokenGeneratorService } from '#application/ports/services/auth/RegistrationTokenGeneratorService.js'
import type { AccountNumberGeneratorService } from '#application/ports/services/AccountNumberGeneratorService.js'
import type { IbanGeneratorService } from '#application/ports/services/IbanGeneratorService.js'
import type { UuidGeneratorService } from '#application/ports/services/UuidGeneratorService.js'
import type { LoanConfigService } from '#application/ports/services/LoanConfigService.js'
import type { TransferLimitService } from '#application/ports/services/TransferLimitService.js'
import type { ValidateTransferService } from '#infrastructure/adapters/services/ValidateTransferService.js'
import type { TransactionEnrichmentService } from '#application/ports/services/TransactionEnrichmentService.js'
import type { NewsPublisher } from '#application/ports/services/news/NewsPublisher.js'
import type { FileStorageService } from '#application/ports/services/news/FileStorageService.js'
import type { AltTextService } from '#application/ports/services/news/AltTextService.js'
import type { OrderService } from '#application/ports/services/news/OrderService.js'
import type { OrderBookService } from '#application/ports/services/order/OrderBookService.js'
import type { OrderMatchingService } from '#application/ports/services/order/OrderMatchingService.js'
import type { AccountService } from '#application/ports/services/AccountService.js'
import type { StockHoldingService } from '#application/ports/services/stocks/StockHoldingService.js'
import type { OrderValidationService } from '#application/ports/services/order/OrderValidationService.js'
import type { LocaleService } from '#application/ports/services/LocaleService.js'
import type { NotificationService } from '#infrastructure/adapters/services/notification/NotificationService.js'
import type { StatusMessageService } from '#application/ports/services/StatusMessageService.js'
import type { EventSubscriberService } from '#infrastructure/adapters/services/EventSubscriberService.js'
import type { RolePriorityService } from '#infrastructure/adapters/services/RolePriorityService.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    // Repositories
    userRepository: UserRepositoryInterface
    roleRepository: RoleRepositoryInterface
    userRoleRepository: UserRoleRepositoryInterface
    accountRepository: AccountRepositoryInterface
    transactionRepository: TransactionRepositoryInterface
    beneficiaryRepository: BeneficiaryRepositoryInterface
    beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface
    notificationRepository: NotificationRepositoryInterface
    loanRequestRepository: LoanRequestRepositoryInterface
    loanRepaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface
    overdraftRequestRepository: OverdraftRequestRepositoryInterface
    savingsAccountRepository: SavingsAccountRepositoryInterface
    savingsProductRepository: SavingsProductRepositoryInterface
    conversationRepository: ConversationRepositoryInterface
    messageRepository: MessageRepositoryInterface
    newsRepository: NewsRepositoryInterface
    mediaRepository: MediaRepositoryInterface
    contentRepository: ContentRepositoryInterface
    stockRepository: StockRepositoryInterface
    stockOrderRepository: StockOrderRepositoryInterface
    holdingRepository: StockHoldingRepositoryInterface
    stockTransactionRepository: StockTransactionRepositoryInterface
    eventBus: EventBusInterface

    // Services
    tokenService: TokenService
    passwordService: PasswordService
    emailService: EmailService
    emailTemplateService: EmailComposerService
    registrationTokenGeneratorService: RegistrationTokenGeneratorService
    accountNumberGenerator: AccountNumberGeneratorService
    ibanGenerator: IbanGeneratorService
    uuidService: UuidGeneratorService
    loanConfigService: LoanConfigService
    transferLimitService: TransferLimitService
    transferValidationService: ValidateTransferService
    transactionEnrichmentService: TransactionEnrichmentService
    newsService: NewsPublisher
    fileStorageService: FileStorageService
    altService: AltTextService
    orderService: OrderService
    orderBookService: OrderBookService
    matchingService: OrderMatchingService
    accountService: AccountService
    holdingService: StockHoldingService
    orderValidationService: OrderValidationService
    localeService: LocaleService
    notificationService: NotificationService
    statusMessageService: StatusMessageService
    rolePriorityService: RolePriorityService
    eventSubscriberService: EventSubscriberService

    // Logger
    logger: LoggerService
  }
}
