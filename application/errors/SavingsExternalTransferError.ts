export class SavingsExternalTransferError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SavingsExternalTransferError";
    }
}
