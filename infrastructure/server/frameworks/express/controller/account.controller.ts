import { Request, Response } from "express";
import { ChangeAccountStatusUseCase } from "../../../../../application/usecases/accounts/ChangeAccountStatusUseCase";
import { CreateAccountUseCase } from "../../../../../application/usecases/accounts/CreateAccountUseCase";
import { DeleteAccountUseCase } from "../../../../../application/usecases/accounts/DeleteAccountUseCase";
import { GetAccountByIbanUseCase } from "../../../../../application/usecases/accounts/GetAccountByIbanUseCase";
import { GetAccountUseCase } from "../../../../../application/usecases/accounts/GetAccountUseCase";
import { GetAllAccountUseCase } from "../../../../../application/usecases/accounts/GetAllAccountsCase";
import { UpdateAccountUseCase } from "../../../../../application/usecases/accounts/UpdateAccountUseCase";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { InvalidAccountError} from "../../../../../domain/errors/InvalidAccountError";
import { AccountAlreadyExistsError } from "../../../../../domain/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../../../../domain/errors/AccountNotFoundError";
import { AllowedAccountStatus } from "../../../../../domain/services/AllowedAccountStatus";
import { InvalidAccountStatusError } from "../../../../../domain/errors/InvalidAccountStatusError";
import { UpdateWithDrawalLimitUseCase } from "../../../../../application/usecases/accounts/UpdateWithDrawalLimitUseCase";
import { UpdateTransferLimitUseCase } from "../../../../../application/usecases/accounts/UpdateTransferLimitUseCase";
import { UpdateOverdraftLimitUseCase } from "../../../../../application/usecases/accounts/UpdateOverdraftLimitUseCase";
import { CustomAccountNameUseCase } from "../../../../../application/usecases/accounts/CustomAccountNameUseCase";
import { ToggleAccountActiveUseCase} from "../../../../../application/usecases/accounts/ToggleAccountActiveUseCase";
import { AccountNumberGeneratorService } from "../../../../../application/ports/services/AccountNumberGeneratorService";
import { IbanGeneratorService } from "../../../../../application/ports/services/IbanGeneratorService";

export class AccountController {



  constructor(
    private readonly accountRepository: InMemoryAccountRepository,
    private readonly accountNumberGenerator: AccountNumberGeneratorService,
    private readonly ibanGenerator: IbanGeneratorService
  ) {}


    async createAnAccount(req: Request, res: Response) {
        const createAnAccount = new CreateAccountUseCase(this.accountRepository, this.accountNumberGenerator, this.ibanGenerator);
        
        const result = await createAnAccount.execute(req.body);
        if(result instanceof Error) {
            if(result instanceof InvalidAccountError){
                return res.status(400).json({ error: result.message })
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
        const result = await getAccountByIbanUseCase.execute(iban ?? "");


        if (result instanceof Error) {

            if(result instanceof AccountNotFoundError) {
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
        
            return res.status(500).json({error : result.message})
        }

        return res.status(200).json({ message: "Account deleted successfully" });

    }

    async changeStatusOfAccount(req: Request, res: Response) {
        const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(this.accountRepository, new AllowedAccountStatus());
        const accountNumber = Number(req.params.accountNumber);
        const status = req.body.status;

        const result = await changeStatusAccountUseCase.execute(accountNumber, status);

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
        const isActive = req.body.isActive;
        const result = await toggleAccountActiveUseCase.execute(accountNumber, isActive);
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
        const newAccountName = req.body.name;

        const result = await updateCustomAccountNameUseCase.execute(accountNumber, newAccountName);

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
        const limit = req.body.limit;

        const result = await updateWithDrawalLimitUseCase.execute(accountNumber, limit);

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
        const limit = req.body.limit;

        const result = await updateTransferLimitUseCase.execute(accountNumber, limit);

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
        const limit = req.body.limit;

        const result = await updateOverdraftLimitUseCase.execute(accountNumber, limit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

}


