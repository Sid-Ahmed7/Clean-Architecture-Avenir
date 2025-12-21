export class FileSizeExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileSizeExceededError";
    }
}