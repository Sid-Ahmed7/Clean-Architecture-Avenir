import { z } from 'zod';
import { AccountTypeEnum } from '../../../../../../domain/enums/AccountTypeEnum';

export const createSubAccountSchema = z.object({
    accountType: z.enum(AccountTypeEnum),
    currency: z.enum(['USD', 'EUR', 'GBP']),
    customAccountName: z.string().optional(),
    parentAccountId: z.number(),
});
