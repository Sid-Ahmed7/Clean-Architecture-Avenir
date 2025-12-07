import { z } from "zod";
import { MediaTypeEnum } from "../../../../../../domain/enums/MediaTypeEnum";

export const createMediaSchema = z.object({
  newsId: z.string(),
  url: z.string(),
  type: z.enum(MediaTypeEnum),
  caption: z.string(),
  altText: z.string(),
  size: z.number(),
  mimeType: z.string(),
});
