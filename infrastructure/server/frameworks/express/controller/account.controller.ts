import { Request, Response } from "express";
import { ChangeAccountStatusUseCase } from "../../../../../application/usecases/accounts/ChangeAccountStatusUseCase";
import { CreateAccountUseCase } from "../../../../../application/usecases/accounts/CreateAccountUseCase";
import { DeleteAccountUseCase } from "../../../../../application/usecases/accounts/DeleteAccountUseCase";
import { GetAccountUseCase } from "../../../../../application/usecases/accounts/GetAccountUseCase";
import { GetAllAccountUseCase } from "../../../../../application/usecases/accounts/GetAllAccountsCase";
import { UpdateAccountUseCase } from "../../../../../application/usecases/accounts/UpdateAccountUseCase";
import { InMemoryAccountRepository } from "../../../adapters/repositories/InMemoryAccountRepository";
import { InvalidAccountError} from "../../../../../domain/errors/InvalidAccountError";
import { AccountAlreadyExistsError } from "../../../../../domain/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../../../../domain/errors/AccountNotFoundError";
import { AllowedAccountStatus } from "../../../../../domain/services/AllowedAccountStatus";
import { InvalidAccountStatusError } from "../../../../../domain/errors/InvalidAccountStatusError";
import { UpdateWithDrawalLimitUseCase } from "../../../../../application/usecases/accounts/UpdateWithDrawalLimitUseCase";
import { UpdateTransferLimitUseCase } from "../../../../../application/usecases/accounts/UpdateTransferLimitUseCase";
import { UpdateOverdraftLimitUseCase } from "../../../../../application/usecases/accounts/UpdateOverdraftLimitUseCase";
import { CustomAccountNameUseCase } from "../../../../../application/usecases/accounts/CustomAccountNameUseCase";

const accountRepository = new InMemoryAccountRepository();
const getAllAccountsUseCase = new GetAllAccountUseCase(accountRepository);
const getAccountUseCase = new GetAccountUseCase(accountRepository);
const createUseCase = new CreateAccountUseCase(accountRepository);
const updateUseCase = new UpdateAccountUseCase(accountRepository);
const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);

const allowedAccountStatus = new AllowedAccountStatus();
const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(accountRepository, allowedAccountStatus); 
const updateCustomAccountName = new CustomAccountNameUseCase(accountRepository);
const updateWithDrawalLimit = new UpdateWithDrawalLimitUseCase(accountRepository);
const updateTransferLimit = new UpdateTransferLimitUseCase(accountRepository);
const updateOverdraftLimit = new UpdateOverdraftLimitUseCase(accountRepository);

export class AccountController {

    async createAnAccount(req: Request, res: Response) {
        
        const result = await createUseCase.execute(req.body);
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
        const result = await updateUseCase.execute(req.body);

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

    async getAllAccount(req: Request, res: Response) {
        const result = await getAllAccountsUseCase.execute();
        
        if(result instanceof Error) {
            return res.status(500).json({error : result.message})
        }

        return res.status(200).json(result);

    }

    async deleteAccount(req: Request, res: Response) {

        const accountNumber = Number(req.params.accountNumber);
        const result = await deleteAccountUseCase.execute(accountNumber);
        
        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }

        return res.status(200).json(result);
    }

    async changeStatusOfAccount(req: Request, res: Response) {
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

    
    async updateAccountName(req: Request, res: Response) {
        const accountNumber = Number(req.params.accountNumber);
        const newAccountName = req.body.name;

        const result = await updateCustomAccountName.execute(accountNumber, newAccountName);

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
        const accountNumber = Number(req.params.accountNumber);
        const limit = req.body.limit;

        const result = await updateWithDrawalLimit.execute(accountNumber, limit);

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
        const limit = req.body.limit;

        const result = await updateTransferLimit.execute(accountNumber, limit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

    async updateOverdraftLimit(req: Request, res: Response) {
        const accountNumber = Number(req.params.accountNumber);
        const limit = req.body.limit;

        const result = await updateOverdraftLimit.execute(accountNumber, limit);

        if(result instanceof Error) {
            if(result instanceof AccountNotFoundError) {
                return res.status(404).json({error: result.message})
            }
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }

}


