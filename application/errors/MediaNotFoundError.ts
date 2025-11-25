export class MediaNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MediaNotFoundError';
    }
}