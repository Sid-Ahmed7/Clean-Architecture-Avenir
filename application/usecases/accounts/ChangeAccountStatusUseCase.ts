import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountAlreadyExistsError } from "../../errors/AccountAlreadyExistsError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AllowedAccountStatusService } from "../../ports/services/AllowedAccountStatusService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";
import { StatusMessageService } from "../../ports/services/StatusMessageService";

export class ChangeAccountStatusUseCase {

    public constructor (
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly allowedStatusCheck: AllowedAccountStatusService,
        private readonly statusMessageService: StatusMessageService,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}
    
    public async execute(accountNumber: number, status: AccountStatusEnum) {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if(account instanceof Error) {
            return account;
        }

        const isAllowed = this.allowedStatusCheck.checkIfAccountStatusIsValid(account.accountStatus, status);

        if(!isAllowed) {
            return new InvalidAccountError("Not allowed to change status");
        }
        

        account.changeAccountStatus(status);
        
        const updatedAccount = await this.accountRepository.updateOneAccount(account);

        if(updatedAccount instanceof Error){
            return updatedAccount;
        }

        if (this.sendNotificationUseCase) {
            const statusMessage = this.statusMessageService.getStatusMessage(status);
            await this.sendNotificationUseCase.execute(
                account.userId,
                `Le statut de votre compte ${account.accountNumber} a été ${statusMessage}.`,
                status === AccountStatusEnum.ACTIVE ? NotificationTypeEnum.INFO : NotificationTypeEnum.ALERT
            );
        }

        return updatedAccount;
    }
}