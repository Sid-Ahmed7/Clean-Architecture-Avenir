import { z } from 'zod';

export const createBeneficiarySchema = z.object({
    iban: z.string(),
    beneficiaryName: z.string(),
    country: z.string(),
    email: z.string().optional(),
    address: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
    }).optional(),
});
