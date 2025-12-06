import { AccountEntity } from "../../../domain/entities/AccountEntity";

export interface TransferLimitService {
    checkAndResetIfNeeded(account: AccountEntity): void;
    canTransfer(account: AccountEntity, amount: number): boolean;
    getRemainingLimit(account: AccountEntity): number;
    recordTransfer(account: AccountEntity, amount: number): void;
}
