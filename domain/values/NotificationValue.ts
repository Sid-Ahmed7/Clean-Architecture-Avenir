import { InvalidNotificationError } from "../errors/InvalidNotificationError";

export class NotificationValue {
    public static from(message: string): NotificationValue | InvalidNotificationError {
        if(!message || message.trim().length === 0) {
            return new InvalidNotificationError(`Notification message cannot be empty: ${message}`);
        }
        return new NotificationValue(message);
    }
    private constructor(public readonly value: string) {}
}