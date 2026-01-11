import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { WithdrawFromSavingsAccount } from "../../requests/WithdrawFromSavingsAccount";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class WithdrawFromSavingsAccountUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ) {}

    public async execute(dto: WithdrawFromSavingsAccount): Promise<SavingsAccountsEntity | Error> {
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.savingsAccountNumber);
        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // Verify ownership
        if (savingsAccount.userId !== dto.userId) {
            return new Error("You do not own this savings account");
        }

        // Verify account is active
        if (!savingsAccount.isActive) {
            return new Error("This savings account is not active");
        }

        // Calculate pending interest before balance change
        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Calculate per minute instead of per day
        const minutesSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * minutesSinceLastUpdate) / (525600 * 100);

        // Check sufficient funds (interest not included in available balance)
        if (savingsAccount.balance < dto.amount) {
            return new Error(`Insufficient funds. Available: ${savingsAccount.balance}€`);
        }

        const userAccounts = await this.accountRepository.getAccountsByUserId(dto.userId);
        if (userAccounts instanceof Error) {
            return userAccounts;
        }

        const mainAccount = userAccounts[0];
        if (!mainAccount) {
            return new Error("No main account found");
        }

        const newBalance = savingsAccount.balance - dto.amount;
        const updatedSavingsAccount = SavingsAccountsEntity.from(
            savingsAccount.accountNumber,
            savingsAccount.productId,
            savingsAccount.userId,
            savingsAccount.interestRate,
            savingsAccount.maxDepositAmount,
            savingsAccount.totalInterestEarned + pendingInterest,
            savingsAccount.isActive,
            newBalance,
            new Date(),
            savingsAccount.lastInterestApplied,
            savingsAccount.maturity
        );

        if (updatedSavingsAccount instanceof Error) {
            return updatedSavingsAccount;
        }

        // Credit main account
        mainAccount.currentBalance += dto.amount;
        const mainAccountUpdate = await this.accountRepository.updateOneAccount(mainAccount);
        if (mainAccountUpdate instanceof Error) {
            return mainAccountUpdate;
        }

        const result = await this.savingsAccountRepository.updateSavingsAccount(updatedSavingsAccount);
        if (result instanceof Error) {
            // Rollback main account
            mainAccount.currentBalance -= dto.amount;
            await this.accountRepository.updateOneAccount(mainAccount);
            return result;
        }


        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                dto.userId,
                `Retrait de ${dto.amount}€ effectué de votre compte d'épargne ${dto.savingsAccountNumber}.`,
                NotificationTypeEnum.INFO
            );
        }

        return result;
    }
}
