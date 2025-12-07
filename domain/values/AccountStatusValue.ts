import { AccountStatusEnum } from "../enums/AccountStatusEnum";
import { InvalidAccountStatusError } from "../errors/InvalidAccountStatusError";

export class AccountStatusValue {

        public static from(status: AccountStatusEnum): AccountStatusValue | InvalidAccountStatusError {

            if(!Object.values(AccountStatusEnum).includes(status)) {
                return new InvalidAccountStatusError(`Invalid Status: ${status}`);
            }

            return new AccountStatusValue(status);
        }
        private constructor(public readonly value: AccountStatusEnum) {}

}