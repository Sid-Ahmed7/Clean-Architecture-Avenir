import { UserRepositoryInterface } from "../../../application/ports/repositories/auth/UserRepositoryInterface";
import { TransactionEnrichmentService } from "../../../application/ports/services/TransactionEnrichmentService";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";

export class TransactionEnrichmentServiceImpl implements TransactionEnrichmentService {
    public constructor(private readonly userRepository: UserRepositoryInterface) {}

    public async enrichTransactionsWithUserNames(transactions: TransactionEntity[]): Promise<TransactionEntity[]> {
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
                debitUserName: debitUser
                    ? `${debitUser.firstName} ${debitUser.lastName}`.trim()
                    : transaction.debitUserName,
                creditUserName: creditUser
                    ? `${creditUser.firstName} ${creditUser.lastName}`.trim()
                    : transaction.creditUserName,
            });
        });
    }
}
