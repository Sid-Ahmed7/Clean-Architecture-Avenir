import z from "zod";

export const transferSchema  = (t:(key: string) => string) =>
     z.object({
        fromIban: z.string().min(10, "IBAN émetteur invalide"),
        toIban: z.string().min(10, "IBAN destinataire invalide"),
        amount: z.number().positive("Montant invalide"),
});

export type TransferModel = z.infer<ReturnType<typeof transferSchema>>;