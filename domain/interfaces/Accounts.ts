import { AccountEntity } from "../entities/AccountEntity";

export interface Accounts {
    mainAccount: AccountEntity;
    subAccounts: Array<AccountEntity>;
}