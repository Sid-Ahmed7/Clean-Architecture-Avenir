import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { StatusMessageService as IStatusMessageService } from "../../../application/ports/services/StatusMessageService";

export class StatusMessageService implements IStatusMessageService {

    public getStatusMessage(status: AccountStatusEnum): string {
        switch (status) {
            case AccountStatusEnum.ACTIVE:
                return 'activé';
            case AccountStatusEnum.SUSPENDED:
                return 'suspendu';
            case AccountStatusEnum.CLOSED:
                return 'fermé';
            case AccountStatusEnum.PENDING:
                return 'en attente';
            default:
                return 'inconnu';
        }
    }
}
