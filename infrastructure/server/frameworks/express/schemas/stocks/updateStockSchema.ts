import { z } from "zod";

export const updateStockSchema = z.object({
    id: z.string().min(1, "Stock ID is required"),
    companyName: z.string().min(1, "Company name is required"),
    name: z.string().min(1, "Stock name is required"),
    currency: z.string().length(3, "Currency must be 3 characters (e.g., USD, EUR)"),
    isActionAvailable: z.boolean(),
});

export type UpdateStockRequest = z.infer<typeof updateStockSchema>;
