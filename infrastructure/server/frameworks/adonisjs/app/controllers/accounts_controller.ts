import type { HttpContext } from '@adonisjs/core/http'
import { ChangeAccountStatusUseCase } from "#application/usecases/accounts/ChangeAccountStatusUseCase.js";
import { CreateAccountUseCase } from "#application/usecases/accounts/CreateAccountUseCase.js";
import { CreateSubAccountUseCase } from "#application/usecases/accounts/CreateSubAccountUseCase.js";
import { DeleteAccountUseCase } from "#application/usecases/accounts/DeleteAccountUseCase.js";
import { GetAccountByIbanUseCase } from "#application/usecases/accounts/GetAccountByIbanUseCase.js";
import { GetAccountUseCase } from "#application/usecases/accounts/GetAccountUseCase.js";
import { GetUserAccountsUseCase } from "#application/usecases/accounts/GetUserAccountsUseCase.js";
import { GetAllAccountUseCase } from "#application/usecases/accounts/GetAllAccountsCase.js";
import { UpdateAccountUseCase } from "#application/usecases/accounts/UpdateAccountUseCase.js";
import { UpdateWithDrawalLimitUseCase } from "#application/usecases/accounts/UpdateWithDrawalLimitUseCase.js";
import { UpdateTransferLimitUseCase } from "#application/usecases/accounts/UpdateTransferLimitUseCase.js";
import { IncreaseTransferLimitUseCase } from "#application/usecases/accounts/IncreaseTransferLimitUseCase.js";
import { UpdateOverdraftLimitUseCase } from "#application/usecases/accounts/UpdateOverdraftLimitUseCase.js";
import { RequestOverdraftIncreaseUseCase } from "#application/usecases/accounts/RequestOverdraftIncreaseUseCase.js";
import { RespondOverdraftIncreaseUseCase } from "#application/usecases/accounts/RespondOverdraftIncreaseUseCase.js";
import { GetPendingOverdraftRequestsUseCase } from "#application/usecases/accounts/GetPendingOverdraftRequestsUseCase.js";
import { GetRibUseCase } from "#application/usecases/accounts/GetRibUseCase.js";
import { CustomAccountNameUseCase } from "#application/usecases/accounts/CustomAccountNameUseCase.js";
import { ToggleAccountActiveUseCase } from "#application/usecases/accounts/ToggleAccountActiveUseCase.js";
import { TransferBetweenAccountsUseCase } from "#application/usecases/transfer/TransferBetweenAccountsUseCase.js";
import { QuickTransferUseCase } from "#application/usecases/transfer/QuickTransferUseCase.js";
import { GetTransactionHistoryUseCase } from "#application/usecases/accounts/GetTransactionHistoryUseCase.js";
import { GetLastTransactionsUseCase } from "#application/usecases/accounts/GetLastTransactionsUseCase.js";
import { ListClientLoanRequestsUseCase } from "#application/usecases/loan/ListClientLoanRequestsUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { AccountNumberGeneratorService } from "#application/ports/services/AccountNumberGeneratorService.js";
import type { IbanGeneratorService } from "#application/ports/services/IbanGeneratorService.js";
import type { TransactionRepositoryInterface } from "#application/ports/repositories/TransactionRepositoryInterface.js";
import type { OverdraftRequestRepositoryInterface } from "#application/ports/repositories/OverdraftRequestRepositoryInterface.js";
import type { LoanRequestRepositoryInterface } from "#application/ports/repositories/LoanRequestRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import type { ManageTransferLimitService } from "#infrastructure/adapters/services/ManageTransferLimitService.js";
import type { ValidateTransferService } from "#infrastructure/adapters/services/ValidateTransferService.js";
import type { TransactionEnrichmentServiceImpl } from "#infrastructure/adapters/services/TransactionEnrichmentService.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import { ManageAllowedAccountStatusService } from "#infrastructure/adapters/services/ManageAllowedAccountStatusService.js";
import { StatusMessageService } from "#infrastructure/adapters/services/StatusMessageService.js";
import { InvalidAccountError } from "#domain/errors/InvalidAccountError.js";
import { AccountAlreadyExistsError } from "#application/errors/AccountAlreadyExistsError.js";
import { AccountNotFoundError } from "#application/errors/AccountNotFoundError.js";
import { InvalidAccountStatusError } from "#domain/errors/InvalidAccountStatusError.js";
import { UserNotFoundError } from "#application/errors/UserNotFoundError.js";
import { InsufficientFundsError } from "#application/errors/InsufficientFundsError.js";
import { TransferLimitExceededError } from "#application/errors/TransferLimitExceededError.js";
import { TransferLimitIncreaseError } from "#application/errors/TransferLimitIncreaseError.js";
import { CannotDeleteLastCheckingAccountError } from "#application/errors/CannotDeleteLastCheckingAccountError.js";
import { NoCheckingAccountForTransferError } from "#application/errors/NoCheckingAccountForTransferError.js";
import { CheckingAccountAlreadyExistError } from "#application/errors/CheckingAccountAlreadyExistError.js";
import { InvalidIbanError } from "#domain/errors/InvalidIbanError.js";
import { InvalidBalanceError } from "#domain/errors/InvalidBalanceError.js";
import { OverdraftActionEnum } from "#domain/enums/OverdraftActionEnum.js";
import { RoleEnum } from "#domain/enums/RoleEnum.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as accountValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/account.js";

export default class AccountsController {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly accountNumberGenerator: AccountNumberGeneratorService,
    private readonly ibanGenerator: IbanGeneratorService,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly overdraftRequestRepository: OverdraftRequestRepositoryInterface,
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly transferLimitService: ManageTransferLimitService,
    private readonly validateTransferService: ValidateTransferService,
    private readonly transactionEnrichmentService: TransactionEnrichmentServiceImpl,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService
  ) {}

  async createAnAccount({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const createAnAccount = new CreateAccountUseCase(
      this.accountRepository,
      this.accountNumberGenerator,
      this.ibanGenerator,
      sendNotificationUseCase
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.createAccountValidator, data: request.body});
    const account = {
      userId: userId,
      accountType: input.accountType,
      currency: input.currency,
      ...(input.customAccountName && { customAccountName: input.customAccountName }),
    };

    const result = await createAnAccount.execute(account);
    if (result instanceof Error) {
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof InvalidIbanError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof AccountAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }

      if (result instanceof CheckingAccountAlreadyExistError) {
        return response.status(409).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async createSubAccount({ request, response, auth }: HttpContext) {
    const createAnAccount = new CreateSubAccountUseCase(
      this.accountRepository,
      this.accountNumberGenerator,
      this.ibanGenerator
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.createSubAccountValidator, data: request.body});

    const account = {
      userId: userId,
      accountType: input.accountType,
      currency: input.currency,
      ...(input.customAccountName && { customAccountName: input.customAccountName }),
      parentAccountId: input.parentAccountId,
    };

    const result = await createAnAccount.execute(account);
    if (result instanceof Error) {
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof InvalidIbanError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof AccountAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async updateAccount({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const updateAccountUseCase = new UpdateAccountUseCase(
      this.accountRepository,
      sendNotificationUseCase
    );

    const input = await vine.validate({schema: accountValidator.updateAccountValidator, data: request.body});

    const result = await updateAccountUseCase.execute(input);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAccount({ request, response }: HttpContext) {
    const getAccountUseCase = new GetAccountUseCase(this.accountRepository);

    const accountNumber = Number(request.param('accountNumber'));
    const result = await getAccountUseCase.execute(accountNumber);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async downloadRib({ request, response, auth }: HttpContext) {
    const userId = auth?.userId;
    const roles = auth?.roles ?? [];

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const accountNumber = Number(request.param('accountNumber'));
    const getRibUseCase = new GetRibUseCase(this.accountRepository, this.userRepository);

    const result = await getRibUseCase.execute(accountNumber, userId, roles);

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof InvalidAccountError) {
      return response.status(403).json({ error: result.message });
    }

    if (result instanceof UserNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAccountByIban({ request, response }: HttpContext) {
    const getAccountByIbanUseCase = new GetAccountByIbanUseCase(this.accountRepository);

    const iban = request.param('iban');
    if (!iban) {
      return response.status(400).json({ error: "IBAN is required" });
    }

    const result = await getAccountByIbanUseCase.execute(iban);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getUserAccounts({ response, auth }: HttpContext) {
    console.log('=== getUserAccounts called ===');
    const getUserAccountsUseCase = new GetUserAccountsUseCase(this.accountRepository);

    const userId = auth?.userId;
    console.log('userId:', userId);

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const result = await getUserAccountsUseCase.execute(userId);
    console.log('result type:', typeof result);
    console.log('result instanceof Error:', result instanceof Error);
    console.log('result:', result);

    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAllAccount({ response }: HttpContext) {
    const getAllAccountsUseCase = new GetAllAccountUseCase(this.accountRepository);
    const result = await getAllAccountsUseCase.execute();

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async deleteAccount({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const deleteAccountUseCase = new DeleteAccountUseCase(
      this.accountRepository,
      sendNotificationUseCase
    );

    const accountNumber = Number(request.param('accountNumber'));
    const result = await deleteAccountUseCase.execute(accountNumber);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof CannotDeleteLastCheckingAccountError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof NoCheckingAccountForTransferError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Account deleted successfully" });
  }

  async changeStatusOfAccount({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(
      this.accountRepository,
      new ManageAllowedAccountStatusService(),
      new StatusMessageService(),
      sendNotificationUseCase
    );

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: accountValidator.changeAccountValidator, data: request.body});


    const result = await changeStatusAccountUseCase.execute(accountNumber, input.status);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountStatusError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async toggleAccountActive({ request, response }: HttpContext) {
    const toggleAccountActiveUseCase = new ToggleAccountActiveUseCase(this.accountRepository);
    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: accountValidator.toggleAccountActiveValidator, data: request.body});


    const result = await toggleAccountActiveUseCase.execute(accountNumber, input.isActive);
    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async updateAccountName({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const updateCustomAccountNameUseCase = new CustomAccountNameUseCase(
      this.accountRepository,
      sendNotificationUseCase
    );

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: accountValidator.updateAccountNameValidator, data: request.body});

    const result = await updateCustomAccountNameUseCase.execute(
      accountNumber,
      input.customAccountName
    );

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async updateWithdrawalLimit({ request, response }: HttpContext) {
    const updateWithDrawalLimitUseCase = new UpdateWithDrawalLimitUseCase(this.accountRepository);
    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: accountValidator.updateWithdrawalLimitValidator, data: request.body});


    const result = await updateWithDrawalLimitUseCase.execute(
      accountNumber,
      input.withdrawalLimit
    );

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async updateTransferLimit({ request, response, auth }: HttpContext) {
    const accountNumber = Number(request.param('accountNumber'));
    const userId = auth?.userId;
    const roles = auth?.roles ?? [];

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.updateTransferLimitValidator, data: request.body});

    const isManager = roles.includes(RoleEnum.BANK_MANAGER);
    const transferLimit = input.transferLimit;

    const managerUseCase = new UpdateTransferLimitUseCase(this.accountRepository);
    const clientUseCase = new IncreaseTransferLimitUseCase(this.accountRepository);

    const result = isManager
      ? await managerUseCase.execute(accountNumber, transferLimit)
      : await clientUseCase.execute(accountNumber, userId, transferLimit);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof InvalidAccountError) {
        return response.status(403).json({ error: result.message });
      }

      if (result instanceof TransferLimitIncreaseError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof InvalidBalanceError) {
        return response.status(400).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async updateOverdraftLimit({ request, response }: HttpContext) {
    const updateOverdraftLimitUseCase = new UpdateOverdraftLimitUseCase(this.accountRepository);
    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: accountValidator.updateOverdraftLimitValidator, data: request.body});

    const result = await updateOverdraftLimitUseCase.execute(
      accountNumber,
      input.overdraftLimit
    );

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async requestOverdraftIncrease({ request, response, auth }: HttpContext) {
    const accountNumber = Number(request.param('accountNumber'));
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.requestOverdraftIncreaseValidator, data: request.body});

    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const useCase = new RequestOverdraftIncreaseUseCase(
      this.accountRepository,
      this.overdraftRequestRepository,
      this.uuidService,
      sendNotificationUseCase
    );

    const result = await useCase.execute(accountNumber, userId, input.overdraftLimit);

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof InvalidAccountError) {
      return response.status(403).json({ error: result.message });
    }

    if (result instanceof InvalidBalanceError) {
      return response.status(400).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getPendingOverdraftRequests({ response, auth }: HttpContext) {
    const roles = auth?.roles ?? [];
    const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
    if (!isAdvisor) {
      return response.status(403).json({ error: "Access denied" });
    }

    const useCase = new GetPendingOverdraftRequestsUseCase(this.overdraftRequestRepository);
    const result = await useCase.execute();
    return response.status(200).json(result);
  }

  async respondOverdraftIncrease({ request, response, auth }: HttpContext) {
    const roles = auth?.roles ?? [];
    const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
    if (!isAdvisor) {
      return response.status(403).json({ error: "Access denied" });
    }

    const input = await vine.validate({schema: accountValidator.respondOverdraftIncreaseValidator, data: request.body});
    const requestId = request.param('requestId');

    if (!requestId) {
      return response.status(400).json({ error: "Request ID is missing" });
    }

    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const useCase = new RespondOverdraftIncreaseUseCase(
      this.overdraftRequestRepository,
      this.accountRepository,
      sendNotificationUseCase
    );

    const actionEnum = input.action === "APPROVE" ? OverdraftActionEnum.APPROVE : OverdraftActionEnum.REJECT;
    const result = await useCase.execute(requestId, actionEnum);

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof InvalidAccountError) {
      return response.status(400).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getOverdraftRequestDetails({ request, response, auth }: HttpContext) {
    const roles = auth?.roles ?? [];
    const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
    if (!isAdvisor) {
      return response.status(403).json({ error: "Access denied" });
    }

    const requestId = request.param('requestId');
    if (!requestId) {
      return response.status(400).json({ error: "Request ID is missing" });
    }

    const requestData = await this.overdraftRequestRepository.findById(requestId);
    if (!requestData) {
      return response.status(404).json({ error: "Request not found" });
    }

    const clientId = requestData.userId;

    const userResult = await this.userRepository.findById(clientId);
    if (userResult instanceof Error) {
      return response.status(404).json({ error: "Client not found" });
    }

    const accounts = await this.accountRepository.getAccountsByUserId(clientId);
    if (accounts instanceof Error) {
      return response.status(400).json({ error: "Accounts unavailable" });
    }

    const loanHistoryUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
    const loanRequests = await loanHistoryUseCase.execute(clientId);

    return response.status(200).json({
      request: requestData,
      client: {
        id: userResult.id,
        firstName: userResult.firstName,
        lastName: userResult.lastName,
        email: userResult.email,
        phoneNumber: userResult.phoneNumber,
        status: userResult.status,
      },
      accounts,
      loanRequests,
    });
  }

  async transferBetweenAccounts({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const transferUseCase = new TransferBetweenAccountsUseCase(
      this.accountRepository,
      this.transactionRepository,
      this.uuidService,
      this.transferLimitService,
      this.validateTransferService,
      sendNotificationUseCase
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.transferBetweenAccountsValidator, data: request.body});

    const result = await transferUseCase.execute({
      fromIban: input.fromIban,
      toIban: input.toIban,
      amount: input.amount,
      userId,
    });

    if (!(result instanceof Error)) {
      return response.status(200).json(result);
    }

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof InsufficientFundsError) {
      return response.status(400).json({ error: result.message });
    }

    if (result instanceof TransferLimitExceededError) {
      return response.status(400).json({ error: result.message });
    }

    if (result instanceof InvalidAccountError) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(500).json({ error: "Unable to process transfer" });
  }

  async quickTransfer({ request, response, auth }: HttpContext) {
    const quickTransferUseCase = new QuickTransferUseCase(
      this.accountRepository,
      this.transactionRepository,
      this.uuidService
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: accountValidator.quickTransferValidator, data: request.body});

    const result = await quickTransferUseCase.execute({
      userId,
      sourceAccountNumber: input.sourceAccountNumber,
      destinationAccountNumber: input.destinationAccountNumber,
      amount: input.amount,
    });

    if (!(result instanceof Error)) {
      return response.status(200).json(result);
    }

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof InsufficientFundsError) {
      return response.status(400).json({ error: result.message });
    }

    if (result instanceof InvalidAccountError) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(500).json({ error: "Unable to process quick transfer" });
  }

  async getTransactionHistory({ response, auth }: HttpContext) {
    console.log('=== getTransactionHistory called ===');
    const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(
      this.transactionRepository,
      this.accountRepository,
      this.transactionEnrichmentService
    );

    const userId = auth?.userId;
    console.log('userId:', userId);

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const result = await getTransactionHistoryUseCase.execute(userId);
    console.log('result type:', typeof result);
    console.log('result instanceof Error:', result instanceof Error);
    console.log('result:', result);

    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getLastTransactions({ request, response, auth }: HttpContext) {
    console.log('=== getLastTransactions called ===');
    const getLastTransactionsUseCase = new GetLastTransactionsUseCase(
      this.transactionRepository,
      this.accountRepository,
      this.transactionEnrichmentService
    );

    const userId = auth?.userId;
    console.log('userId:', userId);

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const limit = request.qs().limit ? Number.parseInt(request.qs().limit as string, 10) : 10;
    console.log('limit:', limit);

    const result = await getLastTransactionsUseCase.execute(userId, limit);
    console.log('result type:', typeof result);
    console.log('result instanceof Error:', result instanceof Error);
    console.log('result:', result);

    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
