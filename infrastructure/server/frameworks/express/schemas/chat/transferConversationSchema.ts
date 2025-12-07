import z from "zod";

export const transferConversationSchema = z.object({
  conversationId: z.string(),
  newAdvisorId: z.string(),
});