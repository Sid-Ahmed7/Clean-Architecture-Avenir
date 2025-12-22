import { Request, Response } from "express";
import { ChangeAccountStatusUseCase } from "../../../../../application/usecases/accounts/ChangeAccountStatusUseCase";
import { CreateAccountUseCase } from "../../../../../application/usecases/accounts/CreateAccountUseCase";
import { CreateSubAccountUseCase } from "../../../../../application/usecases/accounts/CreateSubAccountUseCase";
import { DeleteAccountUseCase } from "../../../../../application/usecases/accounts/DeleteAccountUseCase";
import { GetAccountByIbanUseCase } from "../../../../../application/usecases/accounts/GetAccountByIbanUseCase";
import { GetAccountUseCase } from "../../../../../application/usecases/accounts/GetAccountUseCase";
import { GetUserAccountsUseCase} from "../../../../../application/usecases/accounts/GetUserAccountsUseCase"; 
import { GetAllAccountUseCase } from "../../../../../application/usecases/accounts/GetAllAccountsCase";
import { UpdateAccountUseCase } from "../../../../../application/usecases/accounts/UpdateAccountUseCase";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { InvalidAccountError} from "../../../../../domain/errors/InvalidAccountError";
import { AccountAlreadyExistsError } from "../../../../../application/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../../../../application/errors/AccountNotFoundError";
import { ManageAllowedAccountStatusService } from "../../../../adapters/services/ManageAllowedAccountStatusService";
import { InvalidAccountStatusError } from "../../../../../domain/errors/InvalidAccountStatusError";
import { UpdateWithDrawalLimitUseCase } from "../../../../../application/usecases/accounts/UpdateWithDrawalLimitUseCase";
import { UpdateTransferLimitUseCase } from "../../../../../application/usecases/accounts/UpdateTransferLimitUseCase";
import { IncreaseTransferLimitUseCase } from "../../../../../application/usecases/accounts/IncreaseTransferLimitUseCase";
import { UpdateOverdraftLimitUseCase } from "../../../../../application/usecases/accounts/UpdateOverdraftLimitUseCase";
import { RequestOverdraftIncreaseUseCase } from "../../../../../application/usecases/accounts/RequestOverdraftIncreaseUseCase";
import { RespondOverdraftIncreaseUseCase } from "../../../../../application/usecases/accounts/RespondOverdraftIncreaseUseCase";
import { GetPendingOverdraftRequestsUseCase } from "../../../../../application/usecases/accounts/GetPendingOverdraftRequestsUseCase";
import { GetRibUseCase } from "../../../../../application/usecases/accounts/GetRibUseCase";
import { ListClientLoanRequestsUseCase } from "../../../../../application/usecases/loan/ListClientLoanRequestsUseCase";
import { CustomAccountNameUseCase } from "../../../../../application/usecases/accounts/CustomAccountNameUseCase";
import { ToggleAccountActiveUseCase} from "../../../../../application/usecases/accounts/ToggleAccountActiveUseCase";
import { AccountNumberGeneratorService } from "../../../../../application/ports/services/AccountNumberGeneratorService";
import { IbanGeneratorService } from "../../../../../application/ports/services/IbanGeneratorService";
import { InMemoryTransactionRepository } from "../../../../adapters/repositories/InMemoryTransactionRepository";
import { InMemoryOverdraftRequestRepository } from "../../../../adapters/repositories/InMemoryOverdraftRequestRepository";
import { InMemoryLoanRequestRepository } from "../../../../adapters/repositories/InMemoryLoanRequestRepository";
import { InMemoryUserRepository } from "../../../../adapters/repositories/InMemoryUserRepository";
import { GetTransactionHistoryUseCase } from "../../../../../application/usecases/accounts/GetTransactionHistoryUseCase";
import { GetLastTransactionsUseCase } from "../../../../../application/usecases/accounts/GetLastTransactionsUseCase";
import { CheckingAccountAlreadyExistError } from "../../../../../application/errors/CheckingAccountAlreadyExistError";
import { InvalidIbanError } from "../../../../../domain/errors/InvalidIbanError";
import { GetUserByIdUseCase } from "../../../../../application/usecases/auth/GetUserByIdUseCase";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { TransferBetweenAccountsUseCase } from "../../../../../application/usecases/transfer/TransferBetweenAccountsUseCase";
import { QuickTransferUseCase } from "../../../../../application/usecases/transfer/QuickTransferUseCase";
import { InsufficientFundsError } from "../../../../../application/errors/InsufficientFundsError";
import { TransferLimitExceededError } from "../../../../../application/errors/TransferLimitExceededError";
import { TransferLimitIncreaseError } from "../../../../../application/errors/TransferLimitIncreaseError";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { OverdraftActionEnum } from "../../../../../domain/enums/OverdraftActionEnum";
import { ManageTransferLimitService } from "../../../../adapters/services/ManageTransferLimitService";
import { ValidateTransferService } from "../../../../adapters/services/ValidateTransferService";
import { TransactionEnrichmentServiceImpl } from "../../../../adapters/services/TransactionEnrichmentService";
import { CreateAccount } from "../../../../../application/requests/CreateAccount";
import { createAccountSchema } from "../schemas/accounts/createAccountSchema";
import { CreateSubAccount } from "../../../../../application/requests/CreateSubAccount";
import { createSubAccountSchema } from "../schemas/accounts/createSubAccountSchema";
import { updateAccountSchema } from "../schemas/accounts/updateAccountSchema";
import { AccountEntity } from "../../../../../domain/entities/AccountEntity";
import { AccountStatusEnum } from "../../../../../domain/enums/AccountStatusEnum";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";
import { InvalidBalanceError } from "../../../../../domain/errors/InvalidBalanceError";
import { changeAccountStatusSchema } from "../schemas/accounts/changeAccountStatusSchema";
import { toggleAccountActiveSchema } from "../schemas/accounts/toggleAccountActiveSchema";
import { updateAccountNameSchema } from "../schemas/accounts/updateAccountNameSchema";
import { updateWithdrawalLimitSchema } from "../schemas/accounts/updateWithdrawalLimitSchema";
import { updateTransferLimitSchema } from "../schemas/accounts/updateTransferLimitSchema";
import { updateOverdraftLimitSchema } from "../schemas/accounts/updateOverdraftLimitSchema";
import { requestOverdraftIncreaseSchema } from "../schemas/accounts/requestOverdraftIncreaseSchema";
import { respondOverdraftIncreaseSchema } from "../schemas/accounts/respondOverdraftIncreaseSchema";
import { transferBetweenAccountsSchema } from "../schemas/accounts/transferBetweenAccountsSchema";
import { CannotDeleteLastCheckingAccountError } from "../../../../../application/errors/CannotDeleteLastCheckingAccountError";
import { NoCheckingAccountForTransferError } from "../../../../../application/errors/NoCheckingAccountForTransferError";
import { InMemoryNotificationRepository } from "../../../../adapters/repositories/InMemoryNotificationRepository";
import { NotificationService } from "../../../../adapters/services/notification/NotificationService";
import { SendNotificationToClientUseCase } from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
import { StatusMessageService } from "../../../../adapters/services/StatusMessageService";


export class AccountController {

    constructor(
    private readonly accountRepository: InMemoryAccountRepository,
    private readonly accountNumberGenerator: AccountNumberGeneratorService,
    private readonly ibanGenerator: IbanGeneratorService,
    private readonly transactionRepository: InMemoryTransactionRepository,
    private readonly overdraftRequestRepository: InMemoryOverdraftRequestRepository,
    private readonly loanRequestRepository: InMemoryLoanRequestRepository,
    private readonly userRepository: InMemoryUserRepository,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly transferLimitService: ManageTransferLimitService,
    private readonly validateTransferService: ValidateTransferService,
    private readonly transactionEnrichmentService: TransactionEnrichmentServiceImpl,
    private readonly notificationRepository: InMemoryNotificationRepository,
    private readonly notificationPublisher: NotificationService,
  ) {}


    async createAnAccount(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const createAnAccount = new CreateAccountUseCase(
            this.accountRepository,
            this.accountNumberGenerator,
            this.ibanGenerator,
            sendNotificationUseCase);
        const userId = req.user?.userId;
        
        const parseResult = createAccountSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        if(!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const account: CreateAccount = {
            userId: userId,
            accountType: parseResult.data.accountType,
            currency: parseResult.data.currency,
            ...(parseResult.data.customAccountName && { customAccountName: parseResult.data.customAccountName }),
        }

        const result = await createAnAccount.execute(account);
        if(result instanceof Error) {
            if(result instanceof InvalidAccountError){
                return res.status(400).json({ error: result.message })
            }

            if(result instanceof InvalidIbanError) {
               return res.status(400).json({ error: result.message })
            }

            
            if(result instanceof AccountAlreadyExistsError) {
                return res.status(409).json({error: result.message})
            }
            
            if(result instanceof CheckingAccountAlreadyExistError) {
                return res.status(409).json({error: result.message})
            }

            return res.status(500).json({error: result.message})
        }

        return res.status(201).json(result);
    }

    async createSubAccount(req: Request, res: Response) {
        const createAnAccount = new CreateSubAccountUseCase(this.accountRepository, this.accountNumberGenerator, this.ibanGenerator);
        const parseResult = createSubAccountSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const account: CreateSubAccount = {
            userId: userId,
            accountType: parseResult.data.accountType,
            currency: parseResult.data.currency,
            ...(parseResult.data.customAccountName && { customAccountName: parseResult.data.customAccountName }),
            parentAccountId: parseResult.data.parentAccountId,
        }


        const result = await createAnAccount.execute(account);
        if(result instanceof Error) {
            if(result instanceof InvalidAccountError){
                return res.status(400).json({ error: result.message })
            }
            if(result instanceof InvalidIbanError) {
               return res.status(400).json({ error: result.message })
            }
            if(result instanceof AccountNotFoundError) {
              return res.status(404).json({error: result.message})
            }
            if(result instanceof AccountAlreadyExistsError) {
                return res.status(409).json({error: result.message})
            }


            return res.status(500).json({error: result.message})
        }

        return res.status(201).json(result);
    }
async updateAccount(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const updateAccountUseCase = new UpdateAccountUseCase(
            this.accountRepository,
            sendNotificationUseCase);
        const result = await updateAccountUseCase.execute(req.body);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }

            if(result instanceof InvalidAccountError) {
                return res.status(400).json({error: result.message})
            }

        return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getAccount(req: Request, res: Response) {
       const getAccountUseCase = new GetAccountUseCase(this.accountRepository);

        const accountNumber = Number(req.params.accountNumber);
        const result = await getAccountUseCase.execute(accountNumber);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }

            return res.status(500).json({error : result.message})
        }
        
        return res.status(200).json(result);

    }

    async downloadRib(req: Request, res: Response) {
        const userId = req.user?.userId;
        const roles = req.user?.roles ?? [];

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const accountNumber = Number(req.params.accountNumber);
        const getRibUseCase = new GetRibUseCase(this.accountRepository, this.userRepository);

        const result = await getRibUseCase.execute(accountNumber, userId, roles);

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof InvalidAccountError) {
            return res.status(403).json({ error: result.message });
        }

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getAccountByIban(req: Request, res: Response) {
        const getAccountByIbanUseCase = new GetAccountByIbanUseCase(this.accountRepository);

        const iban = req.params.iban;
        if (!iban) {
            return res.status(400).json({ error: "IBAN is required" });
        }


        const result = await getAccountByIbanUseCase.execute(iban);


        if (result instanceof Error) {

            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({error : result.message})

        }

        return res.status(200).json(result);
    
    }

        async getUserAccounts(req: Request, res: Response) {
        const getUserAccountsUseCase = new GetUserAccountsUseCase(this.accountRepository);

        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await getUserAccountsUseCase.execute(userId);


        if (result instanceof Error) {

            if(result instanceof UserNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({error : result.message})

        }

        return res.status(200).json(result);
    
    }


    async getAllAccount(req: Request, res: Response) {

        const getAllAccountsUseCase = new GetAllAccountUseCase(this.accountRepository);
        const result = await getAllAccountsUseCase.execute();
        
        if(result instanceof Error) {
            return res.status(500).json({error : result.message})
        }

        return res.status(200).json(result);

    }

    async deleteAccount(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const deleteAccountUseCase = new DeleteAccountUseCase(
            this.accountRepository,
            sendNotificationUseCase);
        const accountNumber = Number(req.params.accountNumber);
        const result = await deleteAccountUseCase.execute(accountNumber);
        
        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
            
            if(result instanceof CannotDeleteLastCheckingAccountError) {
                return res.status(400).json({error: result.message})
            }
            
            if(result instanceof NoCheckingAccountForTransferError) {
                return res.status(400).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }

        return res.status(200).json({ message: "Account deleted successfully" });

    }

    async changeStatusOfAccount(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(
            this.accountRepository,
            new ManageAllowedAccountStatusService(),
            new StatusMessageService(),
            sendNotificationUseCase);
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = changeAccountStatusSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        
        const result = await changeStatusAccountUseCase.execute(accountNumber, parseResult.data.status);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
            if(result instanceof InvalidAccountStatusError) {
                return res.status(400).json({error: result.message});
            }

            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async toggleAccountActive(req: Request, res: Response) {
        const toggleAccountActiveUseCase = new ToggleAccountActiveUseCase(this.accountRepository);
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = toggleAccountActiveSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const result = await toggleAccountActiveUseCase.execute(accountNumber, parseResult.data.isActive);
        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            } 
            if (result instanceof InvalidAccountError) {
                return res.status(400).json({ error: result.message });
            } 
            return res.status(500).json({ error: result.message });
        }
        return res.status(200).json(result);
    }

    
    async updateAccountName(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const updateCustomAccountNameUseCase = new CustomAccountNameUseCase(
            this.accountRepository,
            sendNotificationUseCase
        );
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = updateAccountNameSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const result = await updateCustomAccountNameUseCase.execute(accountNumber, parseResult.data.customAccountName);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
            if(result instanceof InvalidAccountError) {
                return res.status(400).json({error: result.message});
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async updateWithdrawalLimit(req: Request, res: Response) {
        const updateWithDrawalLimitUseCase = new UpdateWithDrawalLimitUseCase(this.accountRepository);
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = updateWithdrawalLimitSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await updateWithDrawalLimitUseCase.execute(accountNumber, parseResult.data.withdrawalLimit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async updateTransferLimit(req: Request, res: Response) {
        const accountNumber = Number(req.params.accountNumber);
        const userId = req.user?.userId;
        const roles = req.user?.roles ?? [];

        const parseResult = updateTransferLimitSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const isManager = roles.includes(RoleEnum.BANK_MANAGER);
        const transferLimit = parseResult.data.transferLimit;

        const managerUseCase = new UpdateTransferLimitUseCase(this.accountRepository);
        const clientUseCase = new IncreaseTransferLimitUseCase(this.accountRepository);

        const result = isManager
            ? await managerUseCase.execute(accountNumber, transferLimit)
            : await clientUseCase.execute(accountNumber, userId, transferLimit);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof InvalidAccountError) {
                return res.status(403).json({ error: result.message });
            }

            if (result instanceof TransferLimitIncreaseError) {
                return res.status(400).json({ error: result.message });
            }

            if (result instanceof InvalidBalanceError) {
                return res.status(400).json({ error: result.message });
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async updateOverdraftLimit(req: Request, res: Response) {
        const updateOverdraftLimitUseCase = new UpdateOverdraftLimitUseCase(this.accountRepository);
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = updateOverdraftLimitSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await updateOverdraftLimitUseCase.execute(accountNumber, parseResult.data.overdraftLimit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async requestOverdraftIncrease(req: Request, res: Response) {
        const accountNumber = Number(req.params.accountNumber);
        const userId = req.user?.userId;

        const parseResult = requestOverdraftIncreaseSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const useCase = new RequestOverdraftIncreaseUseCase(
            this.accountRepository,
            this.overdraftRequestRepository,
            this.uuidService,
            sendNotificationUseCase);

        const result = await useCase.execute(accountNumber, userId, parseResult.data.overdraftLimit);

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof InvalidAccountError) {
            return res.status(403).json({ error: result.message });
        }

        if (result instanceof InvalidBalanceError) {
            return res.status(400).json({ error: result.message });
        }

        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
    }

    async getPendingOverdraftRequests(req: Request, res: Response) {
        const roles = req.user?.roles ?? [];
        const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
        if (!isAdvisor) {
            return res.status(403).json({ error: "Access denied" });
        }

        const useCase = new GetPendingOverdraftRequestsUseCase(this.overdraftRequestRepository);
        const result = await useCase.execute();
        return res.status(200).json(result);
    }

    async respondOverdraftIncrease(req: Request, res: Response) {
        const roles = req.user?.roles ?? [];
        const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
        if (!isAdvisor) {
            return res.status(403).json({ error: "Access denied" });
        }

        const parseResult = respondOverdraftIncreaseSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const { action } = parseResult.data;
        const requestId = req.params.requestId;

        if (!requestId) {
            return res.status(400).json({ error: "Request ID is missing" });
        }

        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const useCase = new RespondOverdraftIncreaseUseCase(
            this.overdraftRequestRepository,
            this.accountRepository,
            sendNotificationUseCase
        );

        const actionEnum = action === "APPROVE" ? OverdraftActionEnum.APPROVE : OverdraftActionEnum.REJECT;
        const result = await useCase.execute(requestId, actionEnum);

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof InvalidAccountError) {
            return res.status(400).json({ error: result.message });
        }

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getOverdraftRequestDetails(req: Request, res: Response) {
        const roles = req.user?.roles ?? [];
        const isAdvisor = roles.includes(RoleEnum.BANK_ADVISOR) || roles.includes(RoleEnum.BANK_MANAGER);
        if (!isAdvisor) {
            return res.status(403).json({ error: "Access denied" });
        }

        const requestId = req.params.requestId;
        if (!requestId) {
            return res.status(400).json({ error: "Request ID is missing" });
        }

        const request = await this.overdraftRequestRepository.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        const clientId = request.userId;

        const userResult = await this.userRepository.findById(clientId);
        if (userResult instanceof Error) {
            return res.status(404).json({ error: "Client not found" });
        }

        const accounts = await this.accountRepository.getAccountsByUserId(clientId);
        if (accounts instanceof Error) {
            return res.status(400).json({ error: "Accounts unavailable" });
        }

        const loanHistoryUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
        const loanRequests = await loanHistoryUseCase.execute(clientId);

        return res.status(200).json({
            request,
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

    async transferBetweenAccounts(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const transferUseCase = new TransferBetweenAccountsUseCase(
            this.accountRepository,
            this.transactionRepository,
            this.uuidService,
            this.transferLimitService,
            this.validateTransferService,
            sendNotificationUseCase);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const parseResult = transferBetweenAccountsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const { fromIban, toIban, amount } = parseResult.data;


        const result = await transferUseCase.execute({
            fromIban,
            toIban,
            amount,
            userId,
        });

        if (!(result instanceof Error)) {
            return res.status(200).json(result);
        }

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof InsufficientFundsError) {
            return res.status(400).json({ error: result.message });
        }

        if (result instanceof TransferLimitExceededError) {
            return res.status(400).json({ error: result.message });
        }

        if (result instanceof InvalidAccountError) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(500).json({ error: "Unable to process transfer" });
    }

    async quickTransfer(req: Request, res: Response) {
        const quickTransferUseCase = new QuickTransferUseCase(this.accountRepository,this.transactionRepository,this.uuidService);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { sourceAccountNumber, destinationAccountNumber, amount } = req.body;

        if (!sourceAccountNumber || !destinationAccountNumber || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await quickTransferUseCase.execute({
            userId,
            sourceAccountNumber: parseInt(sourceAccountNumber),
            destinationAccountNumber: parseInt(destinationAccountNumber),
            amount: parseFloat(amount),
        });

        if (!(result instanceof Error)) {
            return res.status(200).json(result);
        }

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        if (result instanceof InsufficientFundsError) {
            return res.status(400).json({ error: result.message });
        }

        if (result instanceof InvalidAccountError) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(500).json({ error: "Unable to process quick transfer" });
    }

    async getTransactionHistory(req: Request, res: Response) {
        const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(this.transactionRepository, this.accountRepository, this.transactionEnrichmentService);

        const userId = req.user?.userId;


        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const result = await getTransactionHistoryUseCase.execute(userId);

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getLastTransactions(req: Request, res: Response) {
        const getLastTransactionsUseCase = new GetLastTransactionsUseCase(this.transactionRepository, this.accountRepository, this.transactionEnrichmentService);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const result = await getLastTransactionsUseCase.execute(userId, limit);

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        return res.status(200).json(result);
    }
}


