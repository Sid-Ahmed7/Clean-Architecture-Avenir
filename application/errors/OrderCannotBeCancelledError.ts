export class OrderCannotBeCancelledError  extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'OrderCannotBeCancelledError ';
    }
}
