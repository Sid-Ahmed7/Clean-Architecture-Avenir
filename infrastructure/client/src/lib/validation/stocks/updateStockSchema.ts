import z from "zod";

export const updateStockSchema = (t: (key: string) => string) => z.object({
  id: z.string(),
  companyName: z.string().min(1, t("validation.companyNameRequired")),
  name: z.string().min(1, t("validation.nameRequired")),
  currency: z.string().min(1, t("validation.currencyRequired")).length(3, t("validation.currencyLength")),
  isActionAvailable: z.boolean(),
});

export type UpdateStock = z.infer<ReturnType<typeof updateStockSchema>>;
