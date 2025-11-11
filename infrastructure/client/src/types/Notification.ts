export enum NotificationEnum {
    INFO = "INFO",
    ALERT = "ALERT",
    ACTION = "ACTION",
    MESSAGING = "MESSAGING",
    SYSTEM = "SYSTEM"
}


export interface Notification {
    id: number;
    userId: string;
    message: string;
    type: NotificationEnum;
    readStatus: "UNREAD" | "READ";
    createAt: string;
    readAt?: string;
    senderId?: string;
}