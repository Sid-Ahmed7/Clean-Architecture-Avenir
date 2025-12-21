import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { TransferLimitService } from "../../../application/ports/services/TransferLimitService";

export class ManageTransferLimitService implements TransferLimitService {

    private static readonly RESET_PERIOD_HOURS = 24;
    private static readonly MS_PER_HOUR = 1000 * 60 * 60;

    public checkAndResetIfNeeded(account: AccountEntity): void {
        const hoursSinceReset = this.calculateHoursSinceReset(account.lastTransferResetDate);

        if (hoursSinceReset >= ManageTransferLimitService.RESET_PERIOD_HOURS) {
            this.resetTransferLimit(account);
        }
    }

    public canTransfer(account: AccountEntity, amount: number): boolean {
        this.checkAndResetIfNeeded(account);
        const remainingLimit = account.transferLimit - account.totalTransfered;
        return remainingLimit >= amount;
    }

    public getRemainingLimit(account: AccountEntity): number {
        this.checkAndResetIfNeeded(account);
        return account.transferLimit - account.totalTransfered;
    }

    public recordTransfer(account: AccountEntity, amount: number): void {
        account.recordTransfer(amount);
    }

    private calculateHoursSinceReset(lastResetDate: Date): number {
        const now = new Date();
        const timeDiff = now.getTime() - new Date(lastResetDate).getTime();
        return timeDiff / ManageTransferLimitService.MS_PER_HOUR;
    }

    private resetTransferLimit(account: AccountEntity): void {
        account.totalTransfered = 0;
        account.lastTransferResetDate = new Date();
    }
}
