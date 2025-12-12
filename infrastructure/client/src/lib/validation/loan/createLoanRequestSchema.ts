import { z } from "zod";

export type CreateLoanRequestInput = {
  advisorId: string;
  amount: number;
  purpose: string;
};

export const createLoanRequestSchema = (t?: (key: string) => string) =>
  z.object({
    advisorId: z.string().min(1, t ? t("errors.advisorRequired") : "Advisor required"),
    amount: z
      .number({ message: t ? t("errors.amountNumber") : "Amount must be a number" })
      .positive(t ? t("errors.amountPositive") : "Amount must be positive"),
    purpose: z
      .string()
      .min(3, t ? t("errors.purposeRequired") : "Purpose is required"),
  });

