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

// Service implementations
import type { JwtTokenService } from '#infrastructure/adapters/services/auth/JwtTokenService.js'
import type { PasswordEncryptionService } from '#infrastructure/adapters/services/auth/PasswordEncryptionService.js'
import type { ResendEmailService } from '#infrastructure/adapters/services/ResendEmailService.js'
import type { EmailTemplateService } from '#infrastructure/adapters/services/EmailTemplateService.js'
import type { RegistrationTokenService } from '#infrastructure/adapters/services/auth/RegistrationTokenService.js'
import type { GenerateAccountNumberService } from '#infrastructure/adapters/services/GenerateAccountNumberService.js'
import type { GenerateIbanService } from '#infrastructure/adapters/services/GenerateIbanService.js'
import type { CryptoUuidGenerator } from '#infrastructure/adapters/services/CryptoUuidGenerator.js'
import type { ManageLoanConfigService } from '#infrastructure/adapters/services/ManageLoanConfigService.js'
import type { ManageTransferLimitService } from '#infrastructure/adapters/services/ManageTransferLimitService.js'
import type { ValidateTransferService } from '#infrastructure/adapters/services/ValidateTransferService.js'
import type { TransactionEnrichmentServiceImpl } from '#infrastructure/adapters/services/TransactionEnrichmentService.js'
import type { NewsService } from '#infrastructure/adapters/services/news/NewsService.js'
import type { LocalFileStorageService } from '#infrastructure/adapters/services/news/LocalFileStorageService.js'
import type { GenerateAltTextService } from '#infrastructure/adapters/services/news/GenerateAltTextService.js'
import type { ManageOrderService } from '#infrastructure/adapters/services/news/ManageOrderService.js'
import type { OrderBookEngineService } from '#infrastructure/adapters/services/order/OrderBookEngineService.js'
import type { OrderMatchingEngineService } from '#infrastructure/adapters/services/order/OrderMatchingEngineService.js'
import type { BankAccountService } from '#infrastructure/adapters/services/BankAccountService.js'
import type { StockHoldingManager } from '#infrastructure/adapters/services/stocks/StockHoldingManager.js'
import type { OrderValidationEngineService } from '#infrastructure/adapters/services/order/OrderValidationEngineService.js'
import type { LocaleValidationService } from '#infrastructure/adapters/services/LocaleValidationService.js'
import type { NotificationService } from '#infrastructure/adapters/services/notification/NotificationService.js'
import type { StatusMessageService } from '#infrastructure/adapters/services/StatusMessageService.js'
import type { ManageAllowedAccountStatusService } from '#infrastructure/adapters/services/ManageAllowedAccountStatusService.js'
import type { EventSubscriberService } from '#infrastructure/adapters/services/EventSubscriberService.js'
import type { RolePriorityService } from '#infrastructure/adapters/services/RolePriorityService.js'
import type { LoggerService } from '@adonisjs/core/types'


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
    tokenService: JwtTokenService
    passwordService: PasswordEncryptionService
    emailService: ResendEmailService
    emailTemplateService: EmailTemplateService
    registrationTokenGeneratorService: RegistrationTokenService
    accountNumberGenerator: GenerateAccountNumberService
    ibanGenerator: GenerateIbanService
    uuidService: CryptoUuidGenerator
    loanConfigService: ManageLoanConfigService
    transferLimitService: ManageTransferLimitService
    transferValidationService: ValidateTransferService
    transactionEnrichmentService: TransactionEnrichmentServiceImpl
    newsService: NewsService
    fileStorageService: LocalFileStorageService
    altService: GenerateAltTextService
    orderService: ManageOrderService
    orderBookService: OrderBookEngineService
    matchingService: OrderMatchingEngineService
    accountService: BankAccountService
    holdingService: StockHoldingManager
    orderValidationService: OrderValidationEngineService
    localeService: LocaleValidationService
    notificationService: NotificationService
    statusMessageService: StatusMessageService
    manageAllowedAccountStatusService: ManageAllowedAccountStatusService
    rolePriorityService: RolePriorityService
    eventSubscriberService: EventSubscriberService

    // Logger
    logger: LoggerService
  }
}
