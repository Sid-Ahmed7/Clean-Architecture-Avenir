import { AccountNumberValue } from "../values/AccountNumberValue";
import { UserIdValue } from "../values/UserIdValue";

import { AccountTypeEnum } from "../enums/AccountTypeEnum";
import { AccountStatusEnum } from "../enums/AccountStatusEnum";
import { IbanValue } from "../values/IbanValue";
import { BalanceValue } from "../values/BalanceValue";

export class AccountEntity {
  public static from(accountNumber: number, iban: string, userId: string, accountType: AccountTypeEnum, currency: string, accountStatus: AccountStatusEnum, isActive: boolean, currentBalance: number = 0, customAccountName?: string, dailyWithdrawalLimit?: number, dailyTransferLimit?: number, overdraftLimit?: number, createdBy?: string, closedAt?: Date, createdAt?: Date) 
   {
    
    const validatedAccountNumber = AccountNumberValue.from(accountNumber);
    if (validatedAccountNumber instanceof Error) return validatedAccountNumber;

    const validatedIBAN = IbanValue.from(iban);
    if (validatedIBAN instanceof Error) return validatedIBAN;

    const validatedUserId = UserIdValue.from(userId);
    if (validatedUserId instanceof Error) return validatedUserId;

    const validatedBalance = BalanceValue.from(currentBalance);
    if (validatedBalance instanceof Error) return validatedBalance;

    return new AccountEntity(
      validatedAccountNumber.value,
      validatedIBAN.value,
      validatedUserId.value,
      accountType,
      validatedBalance.value,
      currency,
      customAccountName,
      dailyWithdrawalLimit,
      dailyTransferLimit,
      overdraftLimit,
      createdBy,
      accountStatus,
      closedAt,
      isActive,
      createdAt ?? new Date()
    );
  }

  private constructor(
    public accountNumber: number,
    public iban: string,
    public userId: string,
    public accountType: AccountTypeEnum,
    public currentBalance: number,
    public currency: string,
    public customAccountName?: string,
    public dailyWithdrawalLimit?: number,
    public dailyTransferLimit?: number,
    public overdraftLimit?: number,
    public createdBy?: string,
    public accountStatus?: AccountStatusEnum,
    public closedAt?: Date,
    public isActive?: boolean,
    public createdAt?: Date
  ) {}
}
