import z from "zod";

export const toggleAccountActiveSchema = z.object({
    isActive: z.boolean(),
});