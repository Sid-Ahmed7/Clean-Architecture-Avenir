import z from "zod";

export const contentSchema = (t:(key: string) => string) => 
     z.object({
  id: z.string(),
  newsId: z.string(),
  order: z.number(),
  content: z.string(),
});

export type ContentModel = z.infer<ReturnType<typeof contentSchema>>;

