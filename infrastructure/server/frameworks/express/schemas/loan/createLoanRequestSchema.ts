import z from "zod";

export const createLoanRequestSchema = z.object({
  advisorId: z.string(),
  amount: z.number().positive(),
  purpose: z.string().min(3),
});

