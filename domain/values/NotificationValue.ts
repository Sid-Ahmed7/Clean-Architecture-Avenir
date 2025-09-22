import { InvalidNotificationError } from "../errors/InvalidNotificationError";

export class NotificationValue {
    public static from(message: string) {
        if(!message || message.trim().length === 0) {
            return new InvalidNotificationError("Notification message cannot by empty");
        }
        return new NotificationValue(message);
    }
    private constructor(public value: string) {}
}