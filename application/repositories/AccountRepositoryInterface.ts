import { AccountEntity } from "../../domain/entities/AccountEntity";
import { InvalidAccountNumberError } from "../../domain/errors/InvalidAccountNumberError";

export interface AccountRepositoryInterface {
    findByAccountNumber(accountNumber: string): Promise<AccountEntity | InvalidAccountNumberError>
    findAllAccounts: Promise<AccountEntity[] | InvalidAccountNumberError>
    createAccount(account: AccountEntity): Promise<AccountEntity | InvalidAccountNumberError>
    updateAccount(account: AccountEntity): Promise<AccountEntity | InvalidAccountNumberError>
    deleteAccount(accountNumber: string): Promise<void | InvalidAccountNumberError>
}