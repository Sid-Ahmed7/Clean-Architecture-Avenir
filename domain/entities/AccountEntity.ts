import { AccountNumberValue } from "../values/AccountNumberValue";
import { UserIdValue } from "../values/UserIdValue";
import { BlockedBalanceValue } from "../values/BlockedBalanceValue";

import { AccountTypeEnum } from "../enums/AccountTypeEnum";
import { AccountStatusEnum } from "../enums/AccountStatusEnum";
import { IbanValue } from "../values/IbanValue";
import { BalanceValue } from "../values/BalanceValue";
import { AccountStatusValue } from "../values/AccountStatusValue";
import { AccountNameValue } from "../values/AccountNameValue";
import {InsufficientFundsError} from "../errors/InsufficientFundsError";
import { InvalidAccountStatusError } from "../errors/InvalidAccountStatusError";
import { InvalidCreditError } from "../errors/InvalidCreditError";

export class AccountEntity {
  public static from(accountNumber: number, iban: string, userId: string, accountType: AccountTypeEnum, currency: string, accountStatus: AccountStatusEnum, isActive: boolean, currentBalance: number = 20, createdAt: Date, withdrawalLimit: number = 3000 , transferLimit: number = 3000, overdraftLimit: number = 1000, customAccountName: string, totalTransfered: number = 0, lastTransferResetDate: Date = new Date(), parentAccountId?: number, closedAt?: Date, blockedBalanced?: number) 
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

    const validatedBlockedBalance = BlockedBalanceValue.from(blockedBalanced ?? 0);
    if (validatedBlockedBalance instanceof Error) return validatedBlockedBalance;

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
      totalTransfered,
      lastTransferResetDate,
      parentAccountId,
      closedAt,
      validatedBlockedBalance.value
    );
  }

  private constructor(
    public readonly accountNumber: number,
    public readonly iban: string,
    public readonly userId: string,
    public readonly accountType: AccountTypeEnum,
    public currentBalance: number,
    public currency: string,
    public accountStatus: AccountStatusEnum,
    public isActive: boolean,
    public withdrawalLimit: number,
    public transferLimit: number,
    public overdraftLimit: number,
    public readonly createdAt: Date,
    public customAccountName: string,
    public totalTransfered: number,
    public lastTransferResetDate: Date,
    public readonly parentAccountId?: number,
    public closedAt?: Date,
    public blockedBalanced?: number,

  ) {}

  public updateBalance(balance: number) {
    this.currentBalance = balance;
  }

  public updateCurrency(newCurrency: string) {
    this.currency = newCurrency;
  }

  public changeAccountStatus(status: AccountStatusEnum) {
    this.accountStatus = status;
    this.isActive = status === AccountStatusEnum.ACTIVE || status === AccountStatusEnum.PENDING;
  }
 public updateIsActive(isActive: boolean) {
        this.isActive = isActive;

        if (!isActive && (this.accountStatus === AccountStatusEnum.ACTIVE || this.accountStatus === AccountStatusEnum.PENDING)) {
            this.accountStatus = AccountStatusEnum.SUSPENDED;
        } else if (isActive && this.accountStatus === AccountStatusEnum.SUSPENDED) {
            this.accountStatus = AccountStatusEnum.ACTIVE;
        }
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
 public getAvailableBalance(overdraftLimit: number = 0): number {
return this.currentBalance - ((this.blockedBalanced ?? 0) + overdraftLimit);
  }

public blockFunds(amount: number): void | InsufficientFundsError {
    if (amount <= 0) {
        return new InsufficientFundsError("Block amount must be positive");
    }
    if (!this.isActive || this.accountStatus !== AccountStatusEnum.ACTIVE) {
        return new InsufficientFundsError("Account not active");
    }
    if (this.currentBalance - (this.blockedBalanced ?? 0) < amount) {
        return new InsufficientFundsError(`Insufficient funds to block. Available: ${this.currentBalance - (this.blockedBalanced ?? 0)}, required: ${amount}`);
    }
    if (!this.blockedBalanced) {
        this.blockedBalanced = 0;
    }
    this.blockedBalanced += amount;
}

  public unblockFunds(amount: number): void | InsufficientFundsError {
    if (amount <= 0) {
        return new InsufficientFundsError("Unblock amount must be positive");
    }
    if (!this.blockedBalanced) {
        this.blockedBalanced = 0;
    }
    if (this.blockedBalanced < amount) {
        return new InsufficientFundsError(`Insufficient blocked funds to unblock. Blocked: ${this.blockedBalanced}, requested: ${amount}`);
    }
    this.blockedBalanced -= amount;
}

public getBlockedBalance(): number {
    return this.blockedBalanced ?? 0;
}
  public hasEnoughFunds(amount: number, overdraftLimit: number = 0): boolean {
    return this.getAvailableBalance(overdraftLimit) >= amount;
  }

  public canTrade(): boolean {
    return this.isActive && this.accountStatus === AccountStatusEnum.ACTIVE && this.currentBalance > 0;
  }

  public debit(amount: number, overdraftLimit: number = 0): void | InsufficientFundsError {
    if (amount <= 0){
      return new InsufficientFundsError("Debit amount must be positive");
    }
    if (!this.isActive || this.accountStatus !== AccountStatusEnum.ACTIVE){
      return new InsufficientFundsError("Account not active");
    }
    if (!this.hasEnoughFunds(amount, overdraftLimit)) {
      return new InsufficientFundsError(`Insufficient funds. Available: ${this.getAvailableBalance(overdraftLimit)}, required: ${amount}`);
    }
    this.currentBalance -= amount;
  }

  public credit(amount: number): void | InvalidCreditError | InvalidAccountStatusError {
    if (amount <= 0){
      return new InvalidCreditError("Credit amount must be positive");
    }
    if (!this.isActive){
      return new InvalidAccountStatusError("Account not active");
    }
    this.currentBalance += amount;
  }

  public getBalance(): number {
    return this.currentBalance;
  }

  public isMainAccount(): boolean {
    return this.parentAccountId === undefined;
  }



}
