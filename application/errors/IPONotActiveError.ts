export class IPONotActiveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "IPONotActiveError";
    }
}
