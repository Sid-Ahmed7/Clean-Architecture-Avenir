import { AccountEntity } from "../../domain/entities/AccountEntity";

export interface Accounts {
    mainAccount: AccountEntity;
    subAccounts: Array<AccountEntity>;
}