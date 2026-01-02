export interface UpdateBeneficiary {
    beneficiaryId: string;
    userId: string;
    beneficiaryName?: string;
    country?: string;
    email?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
    };
}
