import { AccountService } from "../../../application/ports/services/AccountService";
import {AccountRepositoryInterface} from "../../../application/ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../../application/errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
export class BankAccountService implements AccountService {

    public constructor(private accountRepository: AccountRepositoryInterface){}

    public async hasEnoughFunds(userId: string, amount: number): Promise<boolean | AccountNotFoundError> {
        const account = await this.accountRepository.findByUserId(userId);
        
        if (account instanceof AccountNotFoundError) {
            return account;
        }
        return account.getAvailableBalance() >= amount;
    }

    public async debitAccount(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError> {
        const account = await this.accountRepository.findByUserId(userId);
        
        if (account instanceof AccountNotFoundError) {
            return account;
        }
        
        const error = account.debit(amount);
        
        if (error instanceof InsufficientFundsError) {
            return error; 
        }
        await this.accountRepository.updateOneAccount(account);
    }

    public async creditAccount(userId: string, amount: number): Promise<void | AccountNotFoundError> {
        const account = await this.accountRepository.findByUserId(userId);
        
        if (account instanceof AccountNotFoundError) {
            return account;
        }

        account.credit(amount);
        
        await this.accountRepository.updateOneAccount(account);
    }
    public async blockAccountFunds(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError> {
    const account = await this.accountRepository.findByUserId(userId);

    if (account instanceof AccountNotFoundError) {
        return account;
    }

    const error = account.blockFunds(amount);

    if (error instanceof InsufficientFundsError) {
        return error;
    }

    await this.accountRepository.updateOneAccount(account);
}

public async unblockAccountFunds(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError> {
    const account = await this.accountRepository.findByUserId(userId);

    if (account instanceof AccountNotFoundError) {
        return account;
    }

    const error = account.unblockFunds(amount);

    if (error instanceof InsufficientFundsError) {
        return error;
    }

    await this.accountRepository.updateOneAccount(account);
}
}