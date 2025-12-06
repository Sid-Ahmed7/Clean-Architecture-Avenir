import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { TransferLimitService } from "../../../application/ports/services/TransferLimitService";

export class ManageTransferLimitService implements TransferLimitService {

    checkAndResetIfNeeded(account: AccountEntity): void {
        const now = new Date();
        const lastReset = new Date(account.lastTransferResetDate);

        const isSameDay =
            now.getFullYear() === lastReset.getFullYear() &&
            now.getMonth() === lastReset.getMonth() &&
            now.getDate() === lastReset.getDate();

        if (!isSameDay) {
            account.totalTransfered = 0;
            account.lastTransferResetDate = now;
        }
    }

    canTransfer(account: AccountEntity, amount: number): boolean {
        this.checkAndResetIfNeeded(account);
        const remainingLimit = account.transferLimit - account.totalTransfered;
        return remainingLimit >= amount;
    }

    getRemainingLimit(account: AccountEntity): number {
        this.checkAndResetIfNeeded(account);
        return account.transferLimit - account.totalTransfered;
    }

    recordTransfer(account: AccountEntity, amount: number): void {
        account.totalTransfered += amount;
    }
}
