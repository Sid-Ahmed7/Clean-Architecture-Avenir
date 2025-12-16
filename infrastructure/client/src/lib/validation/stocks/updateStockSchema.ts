import z from "zod";

export const updateStockSchema = (t: (key: string) => string) => z.object({
  id: z.string(),
  companyName: z.string(),
  name: z.string(),
  currency: z.string(),
  isActionAvailable: z.boolean(),
});

export type UpdateStock = z.infer<ReturnType<typeof updateStockSchema>>;
