import z from "zod";
export enum NotificationTypeEnum {
    INFO = "INFO",
    ALERT = "ALERT",
    ACTION = "ACTION",
    MESSAGING = "MESSAGING",
    SYSTEM = "SYSTEM"
}
export const createNotificationSchema = z.object({
    message: z.string().min(1, "Le message ne peut pas être vide"),
    type: z.enum(NotificationTypeEnum)
});