export class UnsupportedMediaTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnsupportedMediaTypeError";
    }
}