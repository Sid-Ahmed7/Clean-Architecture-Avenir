export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Beneficiary {
  beneficiaryId: string;
  userId: string;
  iban: string;
  beneficiaryName: string;
  email?: string;
  country?: string;
  address?: Address;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryRequest {
  iban: string;
  beneficiaryName: string;
  email?: string;
  country?: string;
  address?: Address;
}

export interface UpdateBeneficiaryRequest {
  beneficiaryName?: string;
  email?: string;
  country?: string;
  address?: Address;
}
