export class UnauthorizedOrderError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedOrderError';
    }
}
