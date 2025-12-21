import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class UpdateAccountUseCase {
    public constructor (
        private accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}

    public async execute(account: AccountEntity): Promise<AccountEntity | Error> {

        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(account.accountNumber)
        
        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        const updateAccount = await this.accountRepository.updateOneAccount(account);

        if(updateAccount instanceof Error) {
            return updateAccount;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                account.userId,
                `Votre compte ${account.accountNumber} a été mis à jour avec succès.`,
                NotificationTypeEnum.INFO
            );
        }

        return updateAccount;    
    }
    
}