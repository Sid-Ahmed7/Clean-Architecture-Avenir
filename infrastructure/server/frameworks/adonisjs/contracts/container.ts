declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    
    //Repo
    userRepository: typeof import('../../../../adapters/config/repositories.js').userRepository
    roleRepository: typeof import('../../../../adapters/config/repositories.js').roleRepository
    userRoleRepository: typeof import('../../../../adapters/config/repositories.js').userRoleRepository
    accountRepository: typeof import('../../../../adapters/config/repositories.js').accountRepository
    transactionRepository: typeof import('../../../../adapters/config/repositories.js').transactionRepository
    beneficiaryRepository: typeof import('../../../../adapters/config/repositories.js').beneficiaryRepository
    beneficiaryGroupRepository: typeof import('../../../../adapters/config/repositories.js').beneficiaryGroupRepository
    notificationRepository: typeof import('../../../../adapters/config/repositories.js').notificationRepository
    loanRequestRepository: typeof import('../../../../adapters/config/repositories.js').loanRequestRepository
    loanRepaymentScheduleRepository: typeof import('../../../../adapters/config/repositories.js').loanRepaymentScheduleRepository
    overdraftRequestRepository: typeof import('../../../../adapters/config/repositories.js').overdraftRequestRepository
    savingsAccountRepository: typeof import('../../../../adapters/config/repositories.js').savingsAccountRepository
    savingsProductRepository: typeof import('../../../../adapters/config/repositories.js').savingsProductRepository
    conversationRepository: typeof import('../../../../adapters/config/repositories.js').conversationRepository
    messageRepository: typeof import('../../../../adapters/config/repositories.js').messageRepository
    newsRepository: typeof import('../../../../adapters/config/repositories.js').newsRepository
    mediaRepository: typeof import('../../../../adapters/config/repositories.js').mediaRepository
    contentRepository: typeof import('../../../../adapters/config/repositories.js').contentRepository
    stockRepository: typeof import('../../../../adapters/config/repositories.js').stockRepository
    stockOrderRepository: typeof import('../../../../adapters/config/repositories.js').stockOrderRepository
    holdingRepository: typeof import('../../../../adapters/config/repositories.js').holdingRepository
    stockTransactionRepository: typeof import('../../../../adapters/config/repositories.js').stockTransactionRepository
    eventBus: typeof import('../../../../adapters/config/repositories.js').eventBus

    //Service
    tokenService: typeof import('../../../../adapters/config/repositories.js').tokenService
    passwordService: typeof import('../../../../adapters/config/repositories.js').passwordService
    emailService: typeof import('../../../../adapters/config/repositories.js').emailService
    emailTemplateService: typeof import('../../../../adapters/config/repositories.js').emailTemplateService
    registrationTokenGeneratorService: typeof import('../../../../adapters/config/repositories.js').registrationTokenGeneratorService
    accountNumberGenerator: typeof import('../../../../adapters/config/repositories.js').accountNumberGenerator
    ibanGenerator: typeof import('../../../../adapters/config/repositories.js').ibanGenerator
    uuidService: typeof import('../../../../adapters/config/repositories.js').uuidService
    loanConfigService: typeof import('../../../../adapters/config/repositories.js').loanConfigService
    transferLimitService: typeof import('../../../../adapters/config/repositories.js').transferLimitService
    transferValidationService: typeof import('../../../../adapters/config/repositories.js').transferValidationService
    transactionEnrichmentService: typeof import('../../../../adapters/config/repositories.js').transactionEnrichmentService
    newsService: typeof import('../../../../adapters/config/repositories.js').newsService
    fileStorageService: typeof import('../../../../adapters/config/repositories.js').fileStorageService
    altService: typeof import('../../../../adapters/config/repositories.js').altService
    orderService: typeof import('../../../../adapters/config/repositories.js').orderService
    orderBookService: typeof import('../../../../adapters/config/repositories.js').orderBookService
    matchingService: typeof import('../../../../adapters/config/repositories.js').matchingService
    accountService: typeof import('../../../../adapters/config/repositories.js').accountService
    holdingService: typeof import('../../../../adapters/config/repositories.js').holdingService
    orderValidationService: typeof import('../../../../adapters/config/repositories.js').orderValidationService
    localeService: typeof import('../../../../adapters/config/repositories.js').localeService
    notificationService: typeof import('../../../../adapters/config/repositories.js').notificationService
    statusMessageService: typeof import('../../../../adapters/config/repositories.js').statusMessageService

    //logger
    logger: LoggerService


    }
}
