import { z } from 'zod';

export const addBeneficiaryToGroupSchema = z.object({
    beneficiaryId: z.string(),
});
