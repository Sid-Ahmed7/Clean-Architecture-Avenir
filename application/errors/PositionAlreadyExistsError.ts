export class PositionAlreadyExistsError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'PositionAlreadyExistsError';
    }
}
