import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class CustomAccountNameUseCase {
    public constructor(
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}


    public async execute(accountNumber: number, newAccountName: string): Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateCustomAccountName(newAccountName);

        const updatedAccountName = await this.accountRepository.updateOneAccount(account);

        if(updatedAccountName instanceof Error) {
            return updatedAccountName;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                account.userId,
                `Le nom de votre compte a été changé en "${newAccountName}".`,
                NotificationTypeEnum.INFO
            );
        }

        return updatedAccountName;
    }
}