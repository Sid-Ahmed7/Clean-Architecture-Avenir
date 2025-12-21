import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class DeleteAccountUseCase {
    public constructor (
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}
    
    public async execute(accountNumber: number, userId?: string): Promise<void | Error> {
        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(accountNumber)

        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        const accountUserId = userId || existingAccount.userId;
        const account = await this.accountRepository.deleteAccount(accountNumber);

        if(account instanceof Error) {
            return account;
        }

        if (this.sendNotificationUseCase ) {
            await this.sendNotificationUseCase.execute(
                accountUserId,
                `Votre compte a été supprimé.`,
                NotificationTypeEnum.INFO
            );
        }

    }
} 