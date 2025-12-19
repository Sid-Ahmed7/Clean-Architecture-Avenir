import z from "zod";

export const setRateSchema = z.object({
  rate: z.number().positive(),
});

