import { z } from 'zod';

export const updateBeneficiarySchema = z.object({
    beneficiaryName: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    address: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
    }).optional(),
});
