export class SharesBlockingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SharesBlockingError";
    }
}
