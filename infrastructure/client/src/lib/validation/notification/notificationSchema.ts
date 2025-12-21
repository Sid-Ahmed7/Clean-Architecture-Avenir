import z, { number } from "zod";

export const notificationSchema = (t:(key: string) => string) =>
    z.object({
        id: z.string(),
        userId: z.string(),
        message: z.string(),
        type: z.enum(["INFO" ,"ALERT" , "ACTION" , "MESSAGING" ,"SYSTEM"]),
        readStatus: z.enum(["UNREAD", "READ"]),
        createdAt: z.string(),
        senderId: z.string().optional(),
        senderName: z.string().optional(),
        readAt: z.string().optional()
    })

    export type NotificationModel = z.infer<ReturnType<typeof notificationSchema>>;
    