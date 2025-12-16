import { z } from "zod";

export const updateStockSchema = z.object({
    id: z.string(),
    companyName: z.string(),
    name: z.string(),
    currency: z.string(),
    isActionAvailable: z.boolean(),
});

export type UpdateStockRequest = z.infer<typeof updateStockSchema>;
