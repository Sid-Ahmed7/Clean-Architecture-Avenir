import { z } from "zod";

export const changeStockAvailabilitySchema = (t: (key: string) => string) =>
  z.object({
    isActionAvailable: z.boolean(),
  });

export type ChangeStockAvailability = z.infer<ReturnType<typeof changeStockAvailabilitySchema>>;
