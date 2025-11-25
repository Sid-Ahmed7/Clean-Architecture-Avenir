import z from "zod";

export const createContentSchema = (t:(key: string) => string) => 
    z.object({
  newsId: z.number(),
  content: z.string(),
  order: z.number().optional(),
});
export type CreateContentModel = z.infer<ReturnType<typeof createContentSchema>>;
