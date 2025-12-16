import { z } from "zod";

export const matchOrdersSchema = (t: (key: string) => string) =>
  z.object({
    symbol: z.string()
  });

export type MatchOrders = z.infer<ReturnType<typeof matchOrdersSchema>>;
