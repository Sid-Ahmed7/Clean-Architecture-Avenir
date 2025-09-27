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

const accountRepository = new InMemoryAccountRepository();
const getAllAccountsUseCase = new GetAllAccountUseCase(accountRepository);
const getAccountUseCase = new GetAccountUseCase(accountRepository);
const createUseCase = new CreateAccountUseCase(accountRepository);
const updateUseCase = new UpdateAccountUseCase(accountRepository);
const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
const changeStatusAccountUseCase = new ChangeAccountStatusUseCase(accountRepository); 


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
        
            return res.status(500).json({error : result.message})
        }
        return res.status(200).json(result);
    }



}


