import z from "zod";

export const extendedHoursSchema =(t:(key:string) => string) =>
     z.object({
        price: z.number(),
        change: z.number(),
        changePercent: z.number(),
});
export type ExtendedHours = z.infer<typeof extendedHoursSchema>;
