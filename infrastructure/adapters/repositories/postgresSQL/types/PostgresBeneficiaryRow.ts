export interface PostgresBeneficiaryRow {
  beneficiary_id: string;
  user_id: string;
  iban: string;
  beneficiary_name: string;
  email: string | null;
  country: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  address_country: string | null;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}