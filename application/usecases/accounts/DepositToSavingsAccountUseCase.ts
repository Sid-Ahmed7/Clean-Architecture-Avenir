import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { DepositToSavingsAccount } from "../../requests/DepositToSavingsAccount";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class DepositToSavingsAccountUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly savingsProductRepository: SavingsProductRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ) {}

    public async execute(dto: DepositToSavingsAccount): Promise<SavingsAccountsEntity | Error> {
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.savingsAccountNumber);
        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        if (savingsAccount.userId !== dto.userId) {
            return new Error("You do not own this savings account");
        }

        if (!savingsAccount.isActive) {
            return new Error("This savings account is not active");
        }

        const product = await this.savingsProductRepository.getProductById(savingsAccount.productId);
        if (product instanceof Error) {
            return product;
        }

        if (product.minDepositAmount && dto.amount < product.minDepositAmount) {
            return new Error(`Minimum deposit amount is ${product.minDepositAmount}€`);
        }

        const newBalance = savingsAccount.balance + dto.amount;
        if (product.maxDepositAmount && newBalance > product.maxDepositAmount) {
            return new Error(`Maximum balance limit is ${product.maxDepositAmount}€. Current balance: ${savingsAccount.balance}€`);
        }

        const userAccounts = await this.accountRepository.getAccountsByUserId(dto.userId);
        if (userAccounts instanceof Error) {
            return userAccounts;
        }

        const mainAccount = userAccounts[0];
        if (!mainAccount) {
            return new Error("No main account found");
        }

        if (mainAccount.currentBalance < dto.amount) {
            return new Error(`Insufficient funds. Available: ${mainAccount.currentBalance}€`);
        }

        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        // DEMO MODE: Calculate per minute instead of per day
        const minutesSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * minutesSinceLastUpdate) / (525600 * 100);

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

        mainAccount.currentBalance -= dto.amount;
        const mainAccountUpdate = await this.accountRepository.updateOneAccount(mainAccount);
        if (mainAccountUpdate instanceof Error) {
            return mainAccountUpdate;
        }

        const result = await this.savingsAccountRepository.updateSavingsAccount(updatedSavingsAccount);
        if (result instanceof Error) {
            mainAccount.currentBalance += dto.amount;
            await this.accountRepository.updateOneAccount(mainAccount);
            return result;
        }


        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                dto.userId,
                `Dépôt de ${dto.amount}€ effectué sur votre compte d'épargne ${dto.savingsAccountNumber}.`,
                NotificationTypeEnum.INFO
            );
        }

        return result;
    }
}
