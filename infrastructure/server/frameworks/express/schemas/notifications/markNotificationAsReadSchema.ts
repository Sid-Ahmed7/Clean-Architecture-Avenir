import z from "zod";

export const markNotificationAsReadSchema = z.object({
    notificationId: z.string()
});
