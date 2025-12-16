import { z } from 'zod';

export const PurchaseIPOSharesBodySchema = z.object({
    stockSymbol: z.string(),    
    quantity: z.number()
});

export type PurchaseIPOSharesBodyRequest = z.infer<typeof PurchaseIPOSharesBodySchema>;