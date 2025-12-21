import z from "zod";

export const respondOverdraftIncreaseSchema = z.object({
    action: z.enum(["APPROVE", "REJECT"]),
});

