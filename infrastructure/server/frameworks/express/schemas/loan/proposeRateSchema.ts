import z from "zod";

export const proposeRateSchema = z.object({
  rate: z.number().positive(),
});

