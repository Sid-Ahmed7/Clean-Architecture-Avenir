export class NotificationNotFoundError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'NotificationNotFound';
    }
}