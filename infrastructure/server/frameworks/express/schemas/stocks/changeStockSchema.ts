import { z } from "zod";

export const changeStockSchema = z.object({
  isActionAvailable: z.boolean(),

});


