
import z from "zod";
import { fiftyTwoWeekSchema } from "./fiftyTwoWeekSchema";
import { extendedHoursSchema } from "./extendedHoursSchema";


export const stockTwelveDataSchema = (t:(key:string) => string) =>
 z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  currency: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  previousClose: z.number(),
  volume: z.number().optional(),
  averageVolume: z.number().optional(),
  fiftyTwoWeek: fiftyTwoWeekSchema(t).optional(),
  extendedHours: extendedHoursSchema(t).optional(),
  isMarketOpen: z.boolean(),
  lastUpdated: z.string(),
});

export type TwelveDataQuoteResponse = z.infer<typeof stockTwelveDataSchema>;
