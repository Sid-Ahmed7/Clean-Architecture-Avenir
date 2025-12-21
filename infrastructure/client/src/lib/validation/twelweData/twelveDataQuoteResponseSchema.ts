import z from "zod";

export const twelveDataQuoteResponseSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  currency: z.string(),
  datetime: z.string(),
  timestamp: z.number(),
  open: z.string(),
  high: z.string(),
  low: z.string(),
  close: z.string(),
  volume: z.string().optional(),
  previous_close: z.string(),
  change: z.string(),
  percent_change: z.string(),
  average_volume: z.string().optional(),
  is_market_open: z.boolean(),
  fifty_two_week: z.object({
    low: z.string(),
    high: z.string(),
    low_change: z.string(),
    high_change: z.string(),
    low_change_percent: z.string(),
    high_change_percent: z.string(),
  }).optional(),
});

export type TwelveDataQuoteResponse = z.infer<typeof twelveDataQuoteResponseSchema>;
