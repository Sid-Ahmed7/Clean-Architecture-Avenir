export interface CreateBeneficiary {
    userId: string;
    iban: string;
    beneficiaryName: string;
    email?: string;
    country?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}