import type { ApplicationService } from "@adonisjs/core/types";

export default class AppProvider {

    constructor(protected app: ApplicationService) {}

    async register() {
    let repositoriesCache: typeof import("#infrastructure/adapters/config/repositories.js") | null = null;
    const getRepositories = async () => {
      if (!repositoriesCache) {
        repositoriesCache = await import("#infrastructure/adapters/config/repositories.js");
      }
      return repositoriesCache;
    };

    let servicesCache: typeof import("#infrastructure/adapters/config/services.js") | null = null;
    const getServices = async () => {
      if (!servicesCache) {
        servicesCache = await import("#infrastructure/adapters/config/services.js");
      }
      return servicesCache;
    };

    this.app.container.bind('userRepository', async () => (await getRepositories()).userRepository)
    this.app.container.bind('roleRepository', async () => (await getRepositories()).roleRepository)
    this.app.container.bind('userRoleRepository', async () => (await getRepositories()).userRoleRepository)
    this.app.container.bind('accountRepository', async () => (await getRepositories()).accountRepository)
    this.app.container.bind('transactionRepository', async () => (await getRepositories()).transactionRepository)
    this.app.container.bind('beneficiaryRepository', async () => (await getRepositories()).beneficiaryRepository)
    this.app.container.bind('beneficiaryGroupRepository', async () => (await getRepositories()).beneficiaryGroupRepository)
    this.app.container.bind('notificationRepository', async () => (await getRepositories()).notificationRepository)
    this.app.container.bind('loanRequestRepository', async () => (await getRepositories()).loanRequestRepository)
    this.app.container.bind('loanRepaymentScheduleRepository', async () => (await getRepositories()).loanRepaymentScheduleRepository)
    this.app.container.bind('overdraftRequestRepository', async () => (await getRepositories()).overdraftRequestRepository)
    this.app.container.bind('savingsAccountRepository', async () => (await getRepositories()).savingsAccountRepository)
    this.app.container.bind('savingsProductRepository', async () => (await getRepositories()).savingsProductRepository)
    this.app.container.bind('conversationRepository', async () => (await getRepositories()).conversationRepository)
    this.app.container.bind('messageRepository', async () => (await getRepositories()).messageRepository)
    this.app.container.bind('newsRepository', async () => (await getRepositories()).newsRepository)
    this.app.container.bind('mediaRepository', async () => (await getRepositories()).mediaRepository)
    this.app.container.bind('contentRepository', async () => (await getRepositories()).contentRepository)
    this.app.container.bind('stockRepository', async () => (await getRepositories()).stockRepository)
    this.app.container.bind('stockOrderRepository', async () => (await getRepositories()).stockOrderRepository)
    this.app.container.bind('holdingRepository', async () => (await getRepositories()).holdingRepository)
    this.app.container.bind('stockTransactionRepository', async () => (await getRepositories()).stockTransactionRepository)
    this.app.container.bind('eventBus', async () => (await getRepositories()).eventBus)

    // Services
    this.app.container.bind('tokenService', async () => (await getServices()).tokenService)
    this.app.container.bind('passwordService', async () => (await getRepositories()).passwordService)
    this.app.container.bind('emailService', async () => (await getServices()).emailService)
    this.app.container.bind('emailTemplateService', async () => (await getServices()).emailTemplateService)
    this.app.container.bind('registrationTokenGeneratorService', async () => (await getServices()).registrationTokenGeneratorService)
    this.app.container.bind('accountNumberGenerator', async () => (await getServices()).accountNumberGenerator)
    this.app.container.bind('ibanGenerator', async () => (await getServices()).ibanGenerator)
    this.app.container.bind('uuidService', async () => (await getServices()).uuidService)
    this.app.container.bind('loanConfigService', async () => (await getServices()).loanConfigService)
    this.app.container.bind('transferLimitService', async () => (await getServices()).transferLimitService)
    this.app.container.bind('transferValidationService', async () => (await getServices()).transferValidationService)
    this.app.container.bind('transactionEnrichmentService', async () => (await getServices()).transactionEnrichmentService)
    this.app.container.bind('newsService', async () => (await getServices()).newsService)
    this.app.container.bind('fileStorageService', async () => (await getServices()).fileStorageService)
    this.app.container.bind('altService', async () => (await getServices()).altService)
    this.app.container.bind('orderService', async () => (await getServices()).orderService)
    this.app.container.bind('orderBookService', async () => (await getServices()).orderBookService)
    this.app.container.bind('matchingService', async () => (await getServices()).matchingService)
    this.app.container.bind('accountService', async () => (await getServices()).accountService)
    this.app.container.bind('holdingService', async () => (await getServices()).holdingService)
    this.app.container.bind('orderValidationService', async () => (await getServices()).orderValidationService)
    this.app.container.bind('localeService', async () => (await getServices()).localeService)
    this.app.container.bind('notificationService', async () => (await getServices()).notificationService)
    this.app.container.bind('statusMessageService', async () => (await getServices()).statusMessageService)
    this.app.container.bind('manageAllowedAccountStatusService', async () => (await getServices()).manageAllowedAccountStatusService)
    this.app.container.bind('rolePriorityService', async () => (await getServices()).rolePriorityService)
    this.app.container.bind('eventSubscriberService', async () => (await getServices()).eventSubscriberService)
  }

  async boot() {
    const eventSubscriberService = await this.app.container.make('eventSubscriberService')
    const eventBus = await this.app.container.make('eventBus')
    const accountRepository = await this.app.container.make('accountRepository')

    eventSubscriberService.registerUserConfirmedSubscriber(eventBus, accountRepository)
  }
}
