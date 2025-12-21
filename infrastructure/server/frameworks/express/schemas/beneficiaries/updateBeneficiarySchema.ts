import { z } from 'zod';
import { addressSchema } from './addressSchema';

export const updateBeneficiarySchema = z.object({
    beneficiaryName: z.string().optional(),
    email: z.string().optional(),
    country: z.string().optional(),
    address: addressSchema.optional(),
});
