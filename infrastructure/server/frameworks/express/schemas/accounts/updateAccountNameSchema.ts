import z from "zod";

export const updateAccountNameSchema = z.object({
    customAccountName: z.string(),
});