import { AccountStatusEnum } from "../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../domain/enums/AccountTypeEnum";

export interface UpdateAccount {
  accountNumber: number;
  accountType?: AccountTypeEnum;
  currency?: string;
  accountStatus?: AccountStatusEnum; 
  isActive?: boolean;
  customAccountName?: string;
  currentBalance?: number;
  withdrawalLimit?: number;
  transferLimit?: number;
  overdraftLimit?: number;
  totalTransfered?: number;
  lastTransferResetDate?: Date;
  parentAccountId?: number;
  closedAt?: Date;
}
