export interface UpdateBeneficiary {
    beneficiaryId: string;
    userId: string;
    beneficiaryName?: string;
    email?: string;
    country?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}
