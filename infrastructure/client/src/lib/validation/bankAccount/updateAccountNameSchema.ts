import { z } from "zod";

export const updateAccountNameSchema = z.object({
  customAccountName: z
    .string()
    .min(1, "Le nom du compte est requis")
    .max(50, "Le nom du compte ne peut pas dépasser 50 caractères")
    .trim(),
});

export type UpdateAccountNameInput = z.infer<typeof updateAccountNameSchema>;
