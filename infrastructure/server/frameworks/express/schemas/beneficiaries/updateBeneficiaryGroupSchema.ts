import { z } from 'zod';

export const updateBeneficiaryGroupSchema = z.object({
    groupName: z.string().optional(),
    beneficiaryIds: z.array(z.string()).optional(),
});
