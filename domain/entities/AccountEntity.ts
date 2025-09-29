import { AccountNumberValue } from "../values/AccountNumberValue";
import { UserIdValue } from "../values/UserIdValue";

import { AccountTypeEnum } from "../enums/AccountTypeEnum";
import { AccountStatusEnum } from "../enums/AccountStatusEnum";
import { IbanValue } from "../values/IbanValue";
import { BalanceValue } from "../values/BalanceValue";
import { AccountStatusValue } from "../values/AccountStatusValue";
import { AccountNameValue } from "../values/AccountNameValue";

export class AccountEntity {
  public static from(accountNumber: number, iban: string, userId: string, accountType: AccountTypeEnum, currency: string, accountStatus: AccountStatusEnum, isActive: boolean, currentBalance: number = 0, createdAt: Date, withdrawalLimit: number, transferLimit: number, overdraftLimit: number, customAccountName?: string, createdBy?: string, closedAt?: Date) 
   {
    
    const validatedAccountNumber = AccountNumberValue.from(accountNumber);
    if (validatedAccountNumber instanceof Error) return validatedAccountNumber;

    const validatedIBAN = IbanValue.from(iban);
    if (validatedIBAN instanceof Error) return validatedIBAN;

    const validatedUserId = UserIdValue.from(userId);
    if (validatedUserId instanceof Error) return validatedUserId;

    const validatedAccountStatus = AccountStatusValue.from(accountStatus);
    if (validatedAccountStatus instanceof Error) return validatedAccountStatus;

    const validatedCustomAccountName = AccountNameValue.from(customAccountName ?? "")
    if(validatedCustomAccountName instanceof Error) return validatedCustomAccountName;

    const validatedBalance = BalanceValue.from(currentBalance);
    if (validatedBalance instanceof Error) return validatedBalance;

    return new AccountEntity(
      validatedAccountNumber.value,
      validatedIBAN.value,
      validatedUserId.value,
      accountType,
      validatedBalance.value,
      currency,
      validatedAccountStatus.value,
      isActive,
      withdrawalLimit,
      transferLimit,
      overdraftLimit,
      createdAt ?? new Date(),
      validatedCustomAccountName.value,
      createdBy,
      closedAt,
    );
  }

  private constructor(
    public accountNumber: number,
    public iban: string,
    public userId: string,
    public accountType: AccountTypeEnum,
    public currentBalance: number,
    public currency: string,
    public accountStatus: AccountStatusEnum,
    public isActive: boolean,
    public withdrawalLimit: number,
    public transferLimit: number,
    public overdraftLimit: number,
    public createdAt: Date,
    public customAccountName?: string,
    public createdBy?: string,
    public closedAt?: Date,

  ) {}

  public changeAccountStatus(status: AccountStatusEnum) {
    this.accountStatus = status;
  }

  public updateCustomAccountName(name: string) {
    this.customAccountName = name
  }

  public updateWithDrawalLimit(limit: number) {
    this.withdrawalLimit = limit;
  }

  public updateTransferLimit(limit: number) {
    this.transferLimit = limit;
  }

  public updateOverdraftLimit(limit: number) {
    this.overdraftLimit = limit;
  }




}
