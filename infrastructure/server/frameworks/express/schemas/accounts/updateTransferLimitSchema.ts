import z from "zod";

export const updateTransferLimitSchema = z.object({
    transferLimit: z.number(),
});