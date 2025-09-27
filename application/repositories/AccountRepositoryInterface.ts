import { AccountEntity } from "../../domain/entities/AccountEntity";
import { AccountAlreadyExistsError } from "../../domain/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../domain/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../domain/errors/InvalidAccountError";

export interface AccountRepositoryInterface {
    getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError>
    getAllAccounts(): Promise<Array<AccountEntity>>
    createOneAccount(account: AccountEntity): Promise<AccountEntity | AccountAlreadyExistsError | InvalidAccountError >
    updateOneAccount(account: AccountEntity): Promise<AccountEntity | AccountNotFoundError | InvalidAccountError>
    deleteAccount(accountNumber: number): Promise<void | AccountNotFoundError>
}