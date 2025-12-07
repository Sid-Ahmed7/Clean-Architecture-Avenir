import z from "zod";

export const createContentSchema = z.object({
  newsId: z.string(),
  content: z.string(),
});