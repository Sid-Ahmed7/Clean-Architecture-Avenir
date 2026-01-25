import z from "zod";

export const sendGroupMessageSchema = z.object({
    content: z.string()
});