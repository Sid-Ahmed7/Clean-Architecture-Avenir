import { AccountEntity } from "../../domain/entities/AccountEntity";
import { AccountNotFoundError } from "../../domain/errors/AccountNotFoundError";
import { InvalidAccountNumberError } from "../../domain/errors/InvalidAccountNumberError";

export interface AccountRepositoryInterface {
    getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError>
    getAllAccounts(): Promise<AccountEntity[] | AccountNotFoundError>
    createOneAccount(account: AccountEntity): Promise<AccountEntity | InvalidAccountNumberError>
    updateOneAccount(account: AccountEntity): Promise<AccountEntity | InvalidAccountNumberError>
    deleteAccount(accountNumber: number): Promise<void | AccountNotFoundError>
}