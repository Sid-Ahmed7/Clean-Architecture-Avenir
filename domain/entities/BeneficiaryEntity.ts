import {BeneficiaryIdValue} from "../values/BeneficiaryIdValue";
import {UserIdValue} from "../values/UserIdValue";
import {IbanValue} from "../values/IbanValue";
import {BeneficiaryNameValue} from "../values/BeneficiaryNameValue";
import {EmailValue} from "../values/EmailValue";
import {CountryValue} from "../values/CountryValue";
import {AddressValue} from "../values/AddressValue";


export class BeneficiaryEntity {
    public static from(
        beneficiaryId: string,
        userId: string,
        iban: string,
        beneficiaryName: string,
        email?: string,
        country?: string,
        address?: { street: string; city: string; postalCode: string; country: string },
        isVerified: boolean = false,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {

        const validatedBeneficiaryId = BeneficiaryIdValue.from(beneficiaryId);
        if(validatedBeneficiaryId instanceof Error) {
            return validatedBeneficiaryId;
        }

        const validatedUserId = UserIdValue.from(userId);
        if (validatedUserId instanceof Error){
          return validatedUserId;
        }

        const validatedIban = IbanValue.from(iban);
        if (validatedIban instanceof Error) {
            return validatedIban;
        }

        const validatedBeneficiaryName = BeneficiaryNameValue.from(beneficiaryName);
        if (validatedBeneficiaryName instanceof Error){
            return validatedBeneficiaryName;
        }

        // Validation optionnelle de l'email
        let validatedEmail: string | undefined;
        if (email) {
            const emailResult = EmailValue.from(email);
            if (emailResult instanceof Error) {
                return emailResult;
            }
            validatedEmail = emailResult.value;
        }

        // Validation optionnelle du country
        let validatedCountry: string | undefined;
        if (country) {
            const countryResult = CountryValue.from(country);
            if (countryResult instanceof Error) {
                return countryResult;
            }
            validatedCountry = countryResult.value;
        }

        // Validation optionnelle de l'adresse
        let validatedAddress: AddressValue | undefined;
        if (address) {
            const addressResult = AddressValue.from(
                address.street,
                address.city,
                address.postalCode,
                address.country
            );
            if (addressResult instanceof Error) {
                return addressResult;
            }
            validatedAddress = addressResult;
        }

        return new BeneficiaryEntity(
            validatedBeneficiaryId.value,
            validatedUserId.value,
            validatedIban.value,
            validatedBeneficiaryName.value,
            validatedEmail,
            validatedCountry,
            validatedAddress,
            isVerified,
            createdAt,
            updatedAt
        );
    }

  private constructor(
    public readonly beneficiaryId: string,
    public readonly userId: string,
    public readonly iban: string,
    public readonly beneficiaryName: string,
    public readonly email?: string,
    public readonly country?: string,
    public readonly address?: AddressValue,
    public isVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
  
  public verify(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

}