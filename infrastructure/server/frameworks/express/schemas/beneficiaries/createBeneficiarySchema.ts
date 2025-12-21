import { z } from 'zod';
import { addressSchema } from './addressSchema';


export const createBeneficiarySchema = z.object({
    iban: z.string(),
    beneficiaryName: z.string(),
    email: z.string().optional(),
    country: z.string().optional(),
    address: addressSchema.optional(),
});
