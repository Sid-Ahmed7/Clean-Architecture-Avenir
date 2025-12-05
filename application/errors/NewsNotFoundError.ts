export class NewsNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NewsNotFoundError';
    }
}