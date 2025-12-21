export class IPOActiveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "IPOActiveError";
    }
}