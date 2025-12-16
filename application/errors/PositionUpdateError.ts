export class PositionUpdateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PositionUpdateError";
    }
}
