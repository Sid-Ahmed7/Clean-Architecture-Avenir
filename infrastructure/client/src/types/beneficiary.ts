export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface Beneficiary {
  beneficiaryId: string;
  userId: string;
  iban: string;
  beneficiaryName: string;
  country: string;
  email?: string;
  address?: Address;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryRequest {
  iban: string;
  beneficiaryName: string;
  country: string;
  email?: string;
  address?: Address;
}

export interface UpdateBeneficiaryRequest {
  beneficiaryName?: string;
  country?: string;
  email?: string;
  address?: Address;
}
