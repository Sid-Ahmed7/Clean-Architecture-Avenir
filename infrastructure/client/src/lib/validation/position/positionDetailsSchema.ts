import z from "zod";
import { stockPositionSchema } from "./stockPositionSchema";

export const positionDetailsSchema = (t:(key:string) => string) =>
z.object({
  position: stockPositionSchema(t),
  currentPrice: z.number(),
  currentValue: z.number(),
  profitLoss: z.number(),
  profitLossPercent: z.number(),
});
export type PositionDetails = z.infer<ReturnType<typeof positionDetailsSchema>>;
