import z from "zod";

export const createMediaSchema = (t:(key: string) => string) => 
    z.object({
  newsId: z.string(),
  url: z.string(),
  type: z.enum(["IMAGE", "VIDEO"]),
  altText: z.string(),
  caption: z.string(),
  order: z.number(),
  size: z.number(),
  mimeType: z.string(),
});
export type createMediaModel = z.infer<ReturnType<typeof createMediaSchema>>;
