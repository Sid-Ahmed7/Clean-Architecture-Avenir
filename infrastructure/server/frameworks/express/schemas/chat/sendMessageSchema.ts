import z from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string(),
});