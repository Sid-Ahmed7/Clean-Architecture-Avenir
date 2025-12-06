import { AccountEntity } from "../entities/AccountEntity";
import { TransferLimitServiceInterface } from "../../application/ports/services/TransferLimitServiceInterface";

export class TransferLimitService implements TransferLimitServiceInterface {
    private static readonly RESET_PERIOD_HOURS = 24;
    private static readonly MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

    public checkAndResetIfNeeded(account: AccountEntity): void {
        const hoursSinceReset = this.calculateHoursSinceReset(account.lastTransferResetDate);

        if (hoursSinceReset >= TransferLimitService.RESET_PERIOD_HOURS) {
            this.resetTransferLimit(account);
        }
    }

    public canTransfer(account: AccountEntity, amount: number): boolean {
        this.checkAndResetIfNeeded(account);
        return this.getRemainingLimit(account) >= amount;
    }

    public getRemainingLimit(account: AccountEntity): number {
        this.checkAndResetIfNeeded(account);
        return account.transferLimit - account.totalTransfered;
    }

    public recordTransfer(account: AccountEntity, amount: number): void {
        account.totalTransfered += amount;
    }

    private calculateHoursSinceReset(lastResetDate: Date): number {
        const now = new Date();
        const timeDifference = now.getTime() - lastResetDate.getTime();
        return timeDifference / TransferLimitService.MILLISECONDS_PER_HOUR;
    }

    private resetTransferLimit(account: AccountEntity): void {
        account.totalTransfered = 0;
        account.lastTransferResetDate = new Date();
    }
}
