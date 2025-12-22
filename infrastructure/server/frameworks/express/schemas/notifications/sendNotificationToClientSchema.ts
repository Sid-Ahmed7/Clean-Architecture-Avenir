import z from "zod";
export enum NotificationTypeEnum {
    INFO = "INFO",
    ALERT = "ALERT",
    ACTION = "ACTION",
    MESSAGING = "MESSAGING",
    SYSTEM = "SYSTEM"
}
export const sendNotificationToClientSchema = z.object({
    clientId: z.string(),
    message: z.string(),
    type: z.enum(NotificationTypeEnum)
});
