import { z } from 'zod';

export const createBeneficiaryGroupSchema = z.object({
    groupName: z.string(),
    beneficiaryIds: z.array(z.string()).optional().default([]),
});
