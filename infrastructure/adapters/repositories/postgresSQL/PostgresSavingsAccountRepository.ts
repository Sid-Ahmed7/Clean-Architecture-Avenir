import { SavingsAccountRepositoryInterface } from "../../../../application/ports/repositories/SavingsAccountRepositoryInterface";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresSavingsAccountRow } from "./types/PostgresSavingsAccountRow";
import { AccountNotFoundError } from "../../../../application/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../../domain/errors/InvalidAccountError";
import { SavingsAccountsEntity } from "../../../../domain/entities/SavingsAccountEntity";



export class PostgresSavingsAccountRepository implements SavingsAccountRepositoryInterface {

    public async createSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | InvalidAccountError> {
        try {
            const result = await pgPool.query<PostgresSavingsAccountRow>(
                `INSERT INTO savings_accounts (
                    account_number, product_id, user_id, interest_rate, max_deposit_amount,
                    total_interest_earned, is_active, balance, last_balance_update,
                    last_interest_applied, maturity
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [
                    savingsAccount.accountNumber,
                    savingsAccount.productId,
                    savingsAccount.userId,
                    savingsAccount.interestRate,
                    savingsAccount.maxDepositAmount,
                    savingsAccount.totalInterestEarned,
                    savingsAccount.isActive,
                    savingsAccount.balance,
                    savingsAccount.lastBalanceUpdate,
                    savingsAccount.lastInterestApplied,
                    savingsAccount.maturity
                ]
            );

            const created = this.mapRowToEntity(result.rows[0]);
            if (created instanceof Error) {
                return new InvalidAccountError(`Failed to map savings account: ${created.message}`);
            }

            return created;
        } catch (error: any) {
            return new InvalidAccountError(`Failed to create savings account: ${error.message}`);
        }
    }

    public async getSavingsAccountByNumber(accountNumber: number): Promise<SavingsAccountsEntity | AccountNotFoundError> {
        const result = await pgPool.query<PostgresSavingsAccountRow>(
            'SELECT * FROM savings_accounts WHERE account_number = $1',
            [accountNumber]
        );

        if (result.rows.length === 0) {
            return new AccountNotFoundError(`Savings account ${accountNumber} not found`);
        }

        const account = this.mapRowToEntity(result.rows[0]);
        if (account instanceof Error) {
            return new AccountNotFoundError(`Failed to map savings account: ${account.message}`);
        }

        return account;
    }

    public async getSavingsAccountsWithActiveInterest(): Promise<Array<SavingsAccountsEntity>> {
        const result = await pgPool.query<PostgresSavingsAccountRow>(
            'SELECT * FROM savings_accounts WHERE is_active = true'
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((account): account is SavingsAccountsEntity => !(account instanceof Error));
    }

    public async getSavingsAccountsByUserId(userId: string): Promise<SavingsAccountsEntity[] | Error> {
        try {
            const result = await pgPool.query<PostgresSavingsAccountRow>(
                'SELECT * FROM savings_accounts WHERE user_id = $1',
                [userId]
            );

            return result.rows
                .map(row => this.mapRowToEntity(row))
                .filter((account): account is SavingsAccountsEntity => !(account instanceof Error));
        } catch (error: any) {
            return new Error(`Failed to get savings accounts: ${error.message}`);
        }
    }

    public async updateSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | AccountNotFoundError | InvalidAccountError> {
        try {
            const result = await pgPool.query<PostgresSavingsAccountRow>(
                `UPDATE savings_accounts SET
                    interest_rate = $1,
                    max_deposit_amount = $2,
                    total_interest_earned = $3,
                    is_active = $4,
                    balance = $5,
                    last_balance_update = $6,
                    last_interest_applied = $7,
                    maturity = $8
                WHERE account_number = $9
                RETURNING *`,
                [
                    savingsAccount.interestRate,
                    savingsAccount.maxDepositAmount,
                    savingsAccount.totalInterestEarned,
                    savingsAccount.isActive,
                    savingsAccount.balance,
                    savingsAccount.lastBalanceUpdate,
                    savingsAccount.lastInterestApplied,
                    savingsAccount.maturity,
                    savingsAccount.accountNumber
                ]
            );

            if (result.rows.length === 0) {
                return new AccountNotFoundError(`Savings account ${savingsAccount.accountNumber} not found`);
            }

            const updated = this.mapRowToEntity(result.rows[0]);
            if (updated instanceof Error) {
                return new InvalidAccountError(`Failed to map savings account: ${updated.message}`);
            }

            return updated;
        } catch (error: any) {
            return new InvalidAccountError(`Failed to update savings account: ${error.message}`);
        }
    }

    public async getAllSavingsAccounts(): Promise<Array<SavingsAccountsEntity>> {
        const result = await pgPool.query<PostgresSavingsAccountRow>('SELECT * FROM savings_accounts');
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((account): account is SavingsAccountsEntity => !(account instanceof Error));
    }

    private mapRowToEntity(row: PostgresSavingsAccountRow): SavingsAccountsEntity | Error {
        const savingsAccount = SavingsAccountsEntity.from(
            row.account_number,
            row.product_id,
            row.user_id,
            row.interest_rate,
            row.max_deposit_amount,
            row.total_interest_earned,
            row.is_active,
            row.balance,
            row.last_balance_update,
            row.last_interest_applied ?? undefined,
            row.maturity ?? undefined
        );

        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        return savingsAccount;
    }
}