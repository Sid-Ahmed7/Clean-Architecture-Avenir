export class InsufficientIPOSharesError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InsufficientIPOSharesError";
    }
}
