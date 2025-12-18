import { AccountRepositoryInterface } from '../../../../application/ports/repositories/AccountRepositoryInterface';
import { AccountEntity } from '../../../../domain/entities/AccountEntity';
import { pgPool } from '../../config/database/configPostgresSQL';
import { PostgresAccountRow } from './types/PostgresAccountRow';
import { AccountNotFoundError } from '../../../../application/errors/AccountNotFoundError';
import { AccountTypeEnum, AccountStatusEnum } from './types/PostgresEnums';
import { CheckingAccountAlreadyExistError } from '../../../../application/errors/CheckingAccountAlreadyExistError';
import { AccountAlreadyExistsError } from '../../../../application/errors/AccountAlreadyExistsError';
import { UserNotFoundError } from '../../../../application/errors/UserNotFoundError';
import { InvalidAccountError } from '../../../../domain/errors/InvalidAccountError';


export class PostgresAccountRepository implements AccountRepositoryInterface {

    public async getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE account_number = $1',
            [accountNumber]
        );

        if (result.rows.length === 0) {
            return new AccountNotFoundError(`Account with number ${accountNumber} not found.`);
        }

        const row = result.rows[0];

        if (!row) {
            return new AccountNotFoundError(`Account with number ${accountNumber} not found.`);
        }

return this.mapRowToEntity(row);
    }

    public async getOneAccountByIban(iban: string): Promise<AccountEntity | AccountNotFoundError> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE iban = $1',
            [iban]
        );

        if (result.rows.length === 0) {
            return new AccountNotFoundError(`Account with IBAN ${iban} not found.`);
        }

        const row = result.rows[0];

        if (!row) {
            return new AccountNotFoundError(`Account with iban ${iban} not found.`);
        }

        return this.mapRowToEntity(row);
    }

    public async getOneAccountById(accountNumber: number): Promise<AccountEntity | AccountNotFoundError> {
        return this.getOneAccountByAccountNumber(accountNumber);
    }

    public async getAccountsByUserId(userId: string): Promise<Array<AccountEntity> | UserNotFoundError> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return new UserNotFoundError(`No accounts found for user ${userId}`);
        }

        const accounts = result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((account): account is AccountEntity => !(account instanceof Error));   

        return accounts;
    }

        
    public async getSubAccountByParentAccountId(parentAccountId: number): Promise<Array<AccountEntity>> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE parent_account_id = $1',
            [parentAccountId]
        );

          const accounts = result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((account): account is AccountEntity => !(account instanceof Error));   

        return accounts;
    }

    public async findByUserId(userId: string): Promise<AccountEntity | AccountNotFoundError> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE user_id = $1 LIMIT 1',
            [userId]
        );

        if (result.rows.length === 0) {
            return new AccountNotFoundError(`Account for user ${userId} not found.`);
        }

        const row = result.rows[0];

        if (!row) {
            return new AccountNotFoundError(`Account for user ${userId} not found.`);
        }

return this.mapRowToEntity(row);
    }

    public async getAllAccounts(): Promise<Array<AccountEntity>> {
        const result = await pgPool.query<PostgresAccountRow>('SELECT * FROM accounts');
        const accounts = result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((account): account is AccountEntity => !(account instanceof Error));   

        return accounts;    }

    public async findByUserIdAndType(userId: string, accountType: AccountTypeEnum): Promise<null | CheckingAccountAlreadyExistError> {
        const result = await pgPool.query<PostgresAccountRow>(
            'SELECT * FROM accounts WHERE user_id = $1 AND account_type = $2',
            [userId, accountType]
        );

        if (result.rows.length > 0) {
            return new CheckingAccountAlreadyExistError(`User already has a ${accountType} account`);
        }

        return null;
    }

    public async createOneAccount(account: AccountEntity): Promise<AccountEntity | AccountAlreadyExistsError | InvalidAccountError> {
        const existingAccount = await this.getOneAccountByIban(account.iban);
        if (!(existingAccount instanceof AccountNotFoundError)) {
            return new AccountAlreadyExistsError(`Account with IBAN ${account.iban} already exists`);
        }

        const result = await pgPool.query<PostgresAccountRow>(
            `INSERT INTO accounts (
                iban, user_id, account_type, current_balance, currency,
                account_status, is_active, withdrawal_limit, transfer_limit,
                overdraft_limit, created_at, custom_account_name, total_transfered,
                last_transfer_reset_date, parent_account_id, closed_at, blocked_balanced
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [
                account.iban,
                account.userId,
                account.accountType,
                account.currentBalance,
                account.currency,
                account.accountStatus,
                account.isActive,
                account.withdrawalLimit,
                account.transferLimit,
                account.overdraftLimit,
                account.createdAt,
                account.customAccountName,
                account.totalTransfered,
                account.lastTransferResetDate,
                account.parentAccountId,
                account.closedAt,
                account.blockedBalanced
            ]
        );

        const row = result.rows[0];

        if (!row) {
            return new AccountNotFoundError(`Account not found.`);
        }   

        return this.mapRowToEntity(row);
    }

    public async updateOneAccount(account: AccountEntity): Promise<AccountEntity | AccountNotFoundError | InvalidAccountError> {
        const result = await pgPool.query<PostgresAccountRow>(
            `UPDATE accounts SET
                current_balance = $1,
                currency = $2,
                account_status = $3,
                is_active = $4,
                withdrawal_limit = $5,
                transfer_limit = $6,
                overdraft_limit = $7,
                custom_account_name = $8,
                total_transfered = $9,
                last_transfer_reset_date = $10,
                closed_at = $11,
                blocked_balanced = $12
            WHERE account_number = $13
            RETURNING *`,
            [
                account.currentBalance,
                account.currency,
                account.accountStatus,
                account.isActive,
                account.withdrawalLimit,
                account.transferLimit,
                account.overdraftLimit,
                account.customAccountName,
                account.totalTransfered,
                account.lastTransferResetDate,
                account.closedAt,
                account.blockedBalanced,
                account.accountNumber
            ]
        );

        if (result.rows.length === 0) {
            return new AccountNotFoundError(`Account ${account.accountNumber} not found.`);
        }

        const row = result.rows[0];

        if (!row) {
            return new AccountNotFoundError(`Account not found.`);
        }   

        return this.mapRowToEntity(row);
    }

    public async deleteAccount(accountNumber: number): Promise<void | AccountNotFoundError> {
        const result = await pgPool.query(
            'DELETE FROM accounts WHERE account_number = $1',
            [accountNumber]
        );

        if (result.rowCount === 0) {
            return new AccountNotFoundError(`Account ${accountNumber} not found.`);
        }
    }

    private mapRowToEntity(row: PostgresAccountRow): AccountEntity | Error {
        const account = AccountEntity.from(
            row.account_number,
            row.iban,
            row.user_id,
            row.account_type,
            row.currency,
            row.account_status,
            row.is_active,
            row.current_balance,
            row.created_at,
            row.withdrawal_limit ?? 1000,
            row.transfer_limit ?? 5000,
            row.overdraft_limit ?? 0,
            row.custom_account_name ?? '',
            row.total_transfered,
            row.last_transfer_reset_date,
            row.parent_account_id ?? undefined,
            row.closed_at ?? undefined,
            row.blocked_balanced ?? undefined
        );

        if (account instanceof Error) {
            return account;
        }

        return account;
    }
}