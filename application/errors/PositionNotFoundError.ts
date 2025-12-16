export class PositionNotFoundError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'PositionNotFoundError';
    }
}
