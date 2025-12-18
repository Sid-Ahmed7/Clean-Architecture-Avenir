import { z } from 'zod';

export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
