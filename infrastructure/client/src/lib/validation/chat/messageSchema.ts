import z from "zod"


export const messageSchema = (t:(key: string) => string) => 
    z.object({
        conversationId: z.string(),
        conversationClientId: z.string(),
        conversationAdvisorId: z.string(),
        authorId: z.string(),
        content: z.string(),
        readStatus: z.enum(["UNREAD", "READ"]),
        sentAt: z.string()
    })
export type MessageModel = z.infer<ReturnType<typeof messageSchema>>;

