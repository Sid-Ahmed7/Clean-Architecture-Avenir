export class NoCheckingAccountForTransferError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NoCheckingAccountForTransfer";
    }
}
