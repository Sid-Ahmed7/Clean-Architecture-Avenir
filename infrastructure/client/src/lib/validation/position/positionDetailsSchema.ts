import z from "zod";
import { stockPositionSchema } from "./stockPositionSchema";

export const positionDetailsSchema = (t:(key:string) => string) => stockPositionSchema(t);

export type PositionDetails = z.infer<ReturnType<typeof positionDetailsSchema>>;
