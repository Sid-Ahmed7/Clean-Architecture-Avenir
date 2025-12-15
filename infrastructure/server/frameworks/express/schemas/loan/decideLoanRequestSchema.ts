import z from "zod";
import { LoanDecisionEnum } from "../../../../../../domain/enums/LoanDecisionEnum";

export const decideLoanRequestSchema = z.object({
  decision: z.enum(LoanDecisionEnum),
});

