import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";

export interface AccountService {
    hasEnoughFunds(userId: string, amount: number): Promise<boolean | AccountNotFoundError>;
    debitAccount(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError>;
    creditAccount(userId: string, amount: number): Promise<void | AccountNotFoundError>;
    blockAccountFunds(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError>;
    unblockAccountFunds(userId: string, amount: number): Promise<void | AccountNotFoundError | InsufficientFundsError>;
}