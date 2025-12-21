import { z } from "zod";

export const transferToGroupSchema = (t: (key: string) => string) =>
  z.object({
    groupId: z.string(),
    sourceAccountNumber: z.number(),
    amountPerBeneficiary: z.number()
      ,
  });

export type TransferToGroupModel = z.infer<ReturnType<typeof transferToGroupSchema>>;
