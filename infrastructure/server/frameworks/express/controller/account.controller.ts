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
import { UpdateOverdraftLimitUseCase } from "../../../../../application/usecases/accounts/UpdateOverdraftLimitUseCase";
import { CustomAccountNameUseCase } from "../../../../../application/usecases/accounts/CustomAccountNameUseCase";
import { ToggleAccountActiveUseCase} from "../../../../../application/usecases/accounts/ToggleAccountActiveUseCase";
import { AccountNumberGeneratorService } from "../../../../../application/ports/services/AccountNumberGeneratorService";
import { IbanGeneratorService } from "../../../../../application/ports/services/IbanGeneratorService";
import { InMemoryTransactionRepository } from "../../../../adapters/repositories/InMemoryTransactionRepository";
import { GetTransactionHistoryUseCase } from "../../../../../application/usecases/accounts/GetTransactionHistoryUseCase";
import { CheckingAccountAlreadyExistError } from "../../../../../application/errors/CheckingAccountAlreadyExistError";
import { InvalidIbanError } from "../../../../../domain/errors/InvalidIbanError";
import { GetUserByIdUseCase } from "../../../../../application/usecases/auth/GetUserByIdUseCase";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { TransferBetweenAccountsUseCase } from "../../../../../application/usecases/accounts/TransferBetweenAccountsUseCase";
import { InsufficientFundsError } from "../../../../../application/errors/InsufficientFundsError";
import { TransferLimitExceededError } from "../../../../../application/errors/TransferLimitExceededError";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { userRepository } from "../../../../adapters/config/repositories";
import { ManageTransferLimitService } from "../../../../adapters/services/ManageTransferLimitService";
import { ValidateTransferService } from "../../../../adapters/services/ValidateTransferService";
import { CreateAccount } from "../../../../../application/requests/CreateAccount";
import { createAccountSchema } from "../schemas/accounts/createAccountSchema";
import { CreateSubAccount } from "../../../../../application/requests/CreateSubAccount";
import { createSubAccountSchema } from "../schemas/accounts/createSubAccountSchema";
import { updateAccountSchema } from "../schemas/accounts/updateAccountSchema";
import { AccountEntity } from "../../../../../domain/entities/AccountEntity";
import { AccountStatusEnum } from "../../../../../domain/enums/AccountStatusEnum";
import { InvalidUserIdError } from "../../../../../domain/errors/InvalidUserIdError";
import { InvalidBalanceError } from "../../../../../domain/errors/InvalidBalanceError";
import { changeAccountStatusSchema } from "../schemas/accounts/changeAccountStatusSchema";
import { toggleAccountActiveSchema } from "../schemas/accounts/toggleAccountActiveSchema";
import { updateAccountNameSchema } from "../schemas/accounts/updateAccountNameSchema";
import { updateWithdrawalLimitSchema } from "../schemas/accounts/updateWithdrawalLimitSchema";
import { updateTransferLimitSchema } from "../schemas/accounts/updateTransferLimitSchema";
import { updateOverdraftLimitSchema } from "../schemas/accounts/updateOverdraftLimitSchema";
import { transferBetweenAccountsSchema } from "../schemas/accounts/transferBetweenAccountsSchema";


export class AccountController {

    constructor(
    private readonly accountRepository: InMemoryAccountRepository,
    private readonly accountNumberGenerator: AccountNumberGeneratorService,
    private readonly ibanGenerator: IbanGeneratorService,
    private readonly transactionRepository: InMemoryTransactionRepository,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly transferLimitService: ManageTransferLimitService,
    private readonly validateTransferService: ValidateTransferService
  ) {}


    async createAnAccount(req: Request, res: Response) {
        const createAnAccount = new CreateAccountUseCase(this.accountRepository, this.accountNumberGenerator, this.ibanGenerator);
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

        const updateAccountUseCase = new UpdateAccountUseCase(this.accountRepository);
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
        const deleteAccountUseCase = new DeleteAccountUseCase(this.accountRepository);
        const accountNumber = Number(req.params.accountNumber);
        const result = await deleteAccountUseCase.execute(accountNumber);
        
        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
            
            // Import needed at top of file
            const { CannotDeleteLastCheckingAccountError } = require("../../../../../application/errors/CannotDeleteLastCheckingAccountError");
            const { NoCheckingAccountForTransferError } = require("../../../../../application/errors/NoCheckingAccountForTransferError");
            
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
        const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(this.accountRepository, new ManageAllowedAccountStatusService());
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
        const updateCustomAccountNameUseCase = new CustomAccountNameUseCase(this.accountRepository);
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
        const updateTransferLimitUseCase = new UpdateTransferLimitUseCase(this.accountRepository);
        const accountNumber = Number(req.params.accountNumber);
        const parseResult = updateTransferLimitSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await updateTransferLimitUseCase.execute(accountNumber, parseResult.data.transferLimit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
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

    async transferBetweenAccounts(req: Request, res: Response) {
        const transferUseCase = new TransferBetweenAccountsUseCase(
            this.accountRepository,
            this.transactionRepository,
            this.uuidService,
            this.transferLimitService,
            this.validateTransferService
        );
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

    async getTransactionHistory(req: Request, res: Response) {
        const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(this.transactionRepository, this.accountRepository, userRepository);
        
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
}


