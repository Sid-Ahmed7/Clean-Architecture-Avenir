import { z } from "zod";

export const transferBetweenAccountsSchema = (t: (key: string) => string) =>
  z.object({
    fromIban: z
      .string()
      .min(15, t("validation.transfer.iban.minLength"))
      .max(34, t("validation.transfer.iban.maxLength"))
      .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, t("validation.transfer.fromIban.invalid")),
    toIban: z
      .string()
      .min(15, t("validation.transfer.iban.minLength"))
      .max(34, t("validation.transfer.iban.maxLength"))
      .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, t("validation.transfer.toIban.invalid")),
    amount: z
      .number()
      .positive(t("validation.transfer.amount.positive"))
      .min(0.01, t("validation.transfer.amount.minimum")),
  })
  .refine((data) => data.fromIban !== data.toIban, {
    message: t("validation.transfer.sameAccount"),
    path: ["toIban"],
  });

export type TransferBetweenAccountsModel = z.infer<ReturnType<typeof transferBetweenAccountsSchema>>;
