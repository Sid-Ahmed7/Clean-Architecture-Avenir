export interface CreateBeneficiary {
    userId: string;
    iban: string;
    beneficiaryName: string;
    country: string;
    email?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
    };
}