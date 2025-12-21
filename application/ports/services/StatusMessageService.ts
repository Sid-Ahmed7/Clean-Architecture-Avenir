import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";

export interface StatusMessageService {
    getStatusMessage(status: AccountStatusEnum): string;
}
