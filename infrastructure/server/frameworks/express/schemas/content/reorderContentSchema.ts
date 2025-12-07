import { z } from "zod";

export const reorderContentSchema = z.object({
  newOrder: z.array(z.string())
});
