import z from "zod";

export const decideLoanRequestSchema = z.object({
  decision: z.enum(["approve", "reject"]),
});

