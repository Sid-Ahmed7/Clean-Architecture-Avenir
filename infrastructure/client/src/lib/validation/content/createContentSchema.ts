import z from "zod";

export const createContentSchema = (t:(key: string) => string) => 
    z.object({
  newsId: z.string(),
  content: z.string(),
  order: z.number().optional(),
});
export type CreateContentModel = z.infer<ReturnType<typeof createContentSchema>>;
