import z from "zod";

export const fiftyTwoWeekSchema = (t:(key:string) => string) => 
    z.object({
  low: z.number(),
  high: z.number(),
  lowChange: z.number(),
  highChange: z.number(),
  lowChangePercent: z.number(),
  highChangePercent: z.number(),
});

export type FiftyTwoWeek = z.infer<typeof fiftyTwoWeekSchema>;

