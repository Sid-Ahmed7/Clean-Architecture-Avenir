import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";

export class GetTransactionHistoryUseCase {
    public constructor(
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface
    ) {}

    public async execute(userId: string): Promise<TransactionEntity[] | UserNotFoundError> {
        const accountsOrError = await this.accountRepository.getAccountsByUserId(userId);

        if (accountsOrError instanceof UserNotFoundError) {
            return accountsOrError;
        }

        const accountNumbers = accountsOrError.map((account) => account.accountNumber);
        const transactions = await this.transactionRepository.getTransactionsByAccountNumbers(accountNumbers);

        const userIds = Array.from(
            new Set(
                transactions.flatMap((transaction) => [transaction.debitUserId, transaction.creditUserId])
            )
        ).filter(Boolean) as string[];

        if (userIds.length === 0) {
            return transactions;
        }

        const users = await this.userRepository.findByIds(userIds);
        const map = new Map(users.map((user) => [user.id, user]));

        return transactions.map((transaction) => {
            const debitUser = transaction.debitUserId ? map.get(transaction.debitUserId) : undefined;
            const creditUser = transaction.creditUserId ? map.get(transaction.creditUserId) : undefined;

            return Object.assign(Object.create(Object.getPrototypeOf(transaction)), transaction, {
                debitUserName: debitUser ? `${debitUser.firstName} ${debitUser.lastName}`.trim() : undefined,
                creditUserName: creditUser ? `${creditUser.firstName} ${creditUser.lastName}`.trim() : undefined,
            });
        });
    }
}

