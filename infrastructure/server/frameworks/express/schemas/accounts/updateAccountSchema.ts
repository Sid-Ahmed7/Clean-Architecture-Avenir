import { number, z } from "zod";
import { AccountTypeEnum } from "../../../../../../domain/enums/AccountTypeEnum";
import { AccountStatusEnum } from "../../../../../../domain/enums/AccountStatusEnum";

export const updateAccountSchema = z.object({
  accountNumber: z.coerce.number(),
  iban: z.string(),
  userId: z.string(),
  accountType: z.enum(AccountTypeEnum),
  currentBalance: z.number(),
  currency: z.string(),
  accountStatus: z.enum(AccountStatusEnum),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  withdrawalLimit: z.number(),
  transferLimit: z.number(),
  overdraftLimit: z.number(),
  customAccountName: z.string(),
  totalTransfered: z.number(),
  lastTransferResetDate: z.coerce.date(),
  parentAccountId: z.number().optional(),
  closedAt: z.coerce.date().optional(),
});
