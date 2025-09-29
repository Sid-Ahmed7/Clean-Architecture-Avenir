import { AccountStatusEnum } from "../enums/AccountStatusEnum";

export class AllowedAccountStatus {
    
    private rulesStatus: Record<AccountStatusEnum, AccountStatusEnum[]> = {
        [AccountStatusEnum.ACTIVE] : [AccountStatusEnum.BANNED, AccountStatusEnum.CLOSED, AccountStatusEnum.FROZEN, AccountStatusEnum.PENDING, AccountStatusEnum.SUSPENDED],
        [AccountStatusEnum.SUSPENDED] : [AccountStatusEnum.ACTIVE,AccountStatusEnum.CLOSED, AccountStatusEnum.BANNED],
        [AccountStatusEnum.FROZEN] : [AccountStatusEnum.ACTIVE, AccountStatusEnum.CLOSED, AccountStatusEnum.BANNED],
        [AccountStatusEnum.PENDING] : [AccountStatusEnum.ACTIVE, AccountStatusEnum.CLOSED],
        [AccountStatusEnum.CLOSED] : [],
        [AccountStatusEnum.BANNED] : []
    };

    public checkIfAccountStatusIsValid(accountStatus: AccountStatusEnum, newAccountStatus: AccountStatusEnum): boolean {
        return this.rulesStatus[accountStatus].includes(newAccountStatus);
    }

    public getAllowedAccountStatus(accountStatus: AccountStatusEnum) : AccountStatusEnum[] {
        return [...(this.rulesStatus[accountStatus] ?? [])];
    }
}