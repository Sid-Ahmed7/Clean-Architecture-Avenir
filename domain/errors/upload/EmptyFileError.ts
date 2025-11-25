export class EmptyFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmptyFileError";
    }
}