import z from "zod";

export const mediaSchema = (t:(key: string) => string) => 
     z.object({
  id: z.string(),
  newsId: z.string(),
  url: z.string(),
  type: z.enum(["IMAGE", "VIDEO"]),
  altText: z.string(),
  caption: z.string(),
  order: z.number(),
  size: z.number(),
  mimeType: z.string(),
});

export type MediaModel = z.infer<ReturnType<typeof mediaSchema>>;

