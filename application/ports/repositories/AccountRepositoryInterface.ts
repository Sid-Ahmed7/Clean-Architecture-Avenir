import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountAlreadyExistsError } from "../../errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { CheckingAccountAlreadyExistError} from "../../errors/CheckingAccountAlreadyExistError"
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";

export interface AccountRepositoryInterface {
    getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError>
    getOneAccountByIban(iban: string):  Promise<AccountEntity | AccountNotFoundError>
    getAllAccounts(): Promise<Array<AccountEntity>>
    findByUserIdAndType(userId: string, accountType: AccountTypeEnum): Promise<null | CheckingAccountAlreadyExistError>;
    createOneAccount(account: AccountEntity): Promise<AccountEntity | AccountAlreadyExistsError | InvalidAccountError >
    updateOneAccount(account: AccountEntity): Promise<AccountEntity | AccountNotFoundError | InvalidAccountError>
    deleteAccount(accountNumber: number): Promise<void | AccountNotFoundError>
}