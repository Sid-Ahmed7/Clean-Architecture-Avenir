import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";

export interface SavingsAccountRepositoryInterface {
    /**
     * Create a new savings account
     */
    createSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | InvalidAccountError>;
    
    /**
     * Get a savings account by account number
     */
    getSavingsAccountByNumber(accountNumber: number): Promise<SavingsAccountsEntity | AccountNotFoundError>;
    
    /**
     * Get all savings accounts with active interest calculation
     */
    getSavingsAccountsWithActiveInterest(): Promise<Array<SavingsAccountsEntity>>;
    
    /**
     * Update a savings account
     */
    updateSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | AccountNotFoundError | InvalidAccountError>;
    
    /**
     * Get all savings accounts
     */
    getAllSavingsAccounts(): Promise<Array<SavingsAccountsEntity>>;
}
