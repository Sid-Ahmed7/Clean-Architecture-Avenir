import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";

export interface AllowedAccountStatusService {
    checkIfAccountStatusIsValid(accountStatus: AccountStatusEnum, newAccountStatus: AccountStatusEnum): boolean;
    getAllowedAccountStatus(accountStatus: AccountStatusEnum): AccountStatusEnum[];
}
