import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InsufficientFundsError } from "../../errors/InsufficientFundsError";
import { TransferLimitExceededError } from "../../errors/TransferLimitExceededError";

type TransferInput = {
    fromIban: string;
    toIban: string;
    amount: number;
    userId: string;
};

export class TransferBetweenAccountsUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {}

    public async execute(input: TransferInput) {
        const { fromIban, toIban, amount, userId } = input;

        if (fromIban === toIban) {
            return new InvalidAccountError("Cannot transfer to the same account");
        }

        if (isNaN(amount) || amount <= 0) {
            return new InvalidAccountError("Amount must be greater than zero");
        }

        const debitAccount = await this.accountRepository.getOneAccountByIban(fromIban);
        if (debitAccount instanceof AccountNotFoundError) {
            return debitAccount;
        }

        const creditAccount = await this.accountRepository.getOneAccountByIban(toIban);
        if (creditAccount instanceof AccountNotFoundError) {
            return creditAccount;
        }

        if (debitAccount.userId !== userId || creditAccount.userId !== userId) {
            return new InvalidAccountError("Accounts must belong to the same user");
        }

        if (!debitAccount.isActive || !creditAccount.isActive) {
            return new InvalidAccountError("Both accounts must be active");
        }

        if (debitAccount.currency !== creditAccount.currency) {
            return new InvalidAccountError("Accounts must use the same currency");
        }

        if (amount > debitAccount.transferLimit) {
            return new TransferLimitExceededError("Amount exceeds transfer limit");
        }

        const available = debitAccount.currentBalance + debitAccount.overdraftLimit;
        if (amount > available) {
            return new InsufficientFundsError("Insufficient funds");
        }

        debitAccount.updateBalance(debitAccount.currentBalance - amount);
        creditAccount.updateBalance(creditAccount.currentBalance + amount);

        const debitUpdate = await this.accountRepository.updateOneAccount(debitAccount);
        if (debitUpdate instanceof Error) {
            return debitUpdate;
        }

        const creditUpdate = await this.accountRepository.updateOneAccount(creditAccount);
        if (creditUpdate instanceof Error) {
            return creditUpdate;
        }

        return {
            fromAccount: debitUpdate,
            toAccount: creditUpdate,
        };
    }
}

