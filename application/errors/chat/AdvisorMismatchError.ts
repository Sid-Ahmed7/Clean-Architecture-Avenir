export class AdvisorMismatchError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AdvisorMismatchError";
    }
}