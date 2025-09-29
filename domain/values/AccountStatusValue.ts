import { AccountStatusEnum } from "../enums/AccountStatusEnum";
import { InvalidAccountStatusError } from "../errors/InvalidAccountStatusError";
import { AllowedAccountStatus } from "../services/AllowedAccountStatus";

export class AccountStatusValue {

        public static from(status: AccountStatusEnum) {

            if(!Object.values(AccountStatusEnum).includes(status)) {
                return new InvalidAccountStatusError("Invalid Status");
            }

            return new AccountStatusValue(status);
        }
        private constructor(public value: AccountStatusEnum) {}

}