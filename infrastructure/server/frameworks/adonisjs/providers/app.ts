import type { ApplicationService } from "@adonisjs/core/types";
import * as repositories from "#infrastructure/adapters/config/repositories.js";
export default class AppProvider {

    constructor(protected app: ApplicationService) {}

    async register() {

    this.app.container.bind('userRepository', () => repositories.userRepository)
    this.app.container.bind('roleRepository', () => repositories.roleRepository)
    this.app.container.bind('userRoleRepository', () => repositories.userRoleRepository)
    this.app.container.bind('accountRepository', () => repositories.accountRepository)
    this.app.container.bind('transactionRepository', () => repositories.transactionRepository)
    this.app.container.bind('beneficiaryRepository', () => repositories.beneficiaryRepository)
    this.app.container.bind('beneficiaryGroupRepository', () => repositories.beneficiaryGroupRepository)
    this.app.container.bind('notificationRepository', () => repositories.notificationRepository)
    this.app.container.bind('loanRequestRepository', () => repositories.loanRequestRepository)
    this.app.container.bind('loanRepaymentScheduleRepository', () => repositories.loanRepaymentScheduleRepository)
    this.app.container.bind('overdraftRequestRepository', () => repositories.overdraftRequestRepository)
    this.app.container.bind('savingsAccountRepository', () => repositories.savingsAccountRepository)
    this.app.container.bind('savingsProductRepository', () => repositories.savingsProductRepository)
    this.app.container.bind('conversationRepository', () => repositories.conversationRepository)
    this.app.container.bind('messageRepository', () => repositories.messageRepository)
    this.app.container.bind('newsRepository', () => repositories.newsRepository)
    this.app.container.bind('mediaRepository', () => repositories.mediaRepository)
    this.app.container.bind('contentRepository', () => repositories.contentRepository)
    this.app.container.bind('stockRepository', () => repositories.stockRepository)
    this.app.container.bind('stockOrderRepository', () => repositories.stockOrderRepository)
    this.app.container.bind('holdingRepository', () => repositories.holdingRepository)
    this.app.container.bind('stockTransactionRepository', () => repositories.stockTransactionRepository)
    this.app.container.bind('eventBus', () => repositories.eventBus)

    // Services
    this.app.container.bind('tokenService', () => repositories.tokenService)
    this.app.container.bind('passwordService', () => repositories.passwordService)
    this.app.container.bind('emailService', () => repositories.emailService)
    this.app.container.bind('emailTemplateService', () => repositories.emailTemplateService)
    this.app.container.bind('registrationTokenGeneratorService', () => repositories.registrationTokenGeneratorService)
    this.app.container.bind('accountNumberGenerator', () => repositories.accountNumberGenerator)
    this.app.container.bind('ibanGenerator', () => repositories.ibanGenerator)
    this.app.container.bind('uuidService', () => repositories.uuidService)
    this.app.container.bind('loanConfigService', () => repositories.loanConfigService)
    this.app.container.bind('transferLimitService', () => repositories.transferLimitService)
    this.app.container.bind('transferValidationService', () => repositories.transferValidationService)
    this.app.container.bind('transactionEnrichmentService', () => repositories.transactionEnrichmentService)
    this.app.container.bind('newsService', () => repositories.newsService)
    this.app.container.bind('fileStorageService', () => repositories.fileStorageService)
    this.app.container.bind('altService', () => repositories.altService)
    this.app.container.bind('orderService', () => repositories.orderService)
    this.app.container.bind('orderBookService', () => repositories.orderBookService)
    this.app.container.bind('matchingService', () => repositories.matchingService)
    this.app.container.bind('accountService', () => repositories.accountService)
    this.app.container.bind('holdingService', () => repositories.holdingService)
    this.app.container.bind('orderValidationService', () => repositories.orderValidationService)
    this.app.container.bind('localeService', () => repositories.localeService)
    this.app.container.bind('notificationService', () => repositories.notificationService)
    this.app.container.bind('statusMessageService', () => repositories.statusMessageService)
  }
}
