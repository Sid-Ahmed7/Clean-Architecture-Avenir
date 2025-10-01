import { InvalidIbanError } from "../errors/InvalidIbanError";


export class IbanValue {
    public static from(iban: string) {

        const cleanedIban = iban.replace(/\s+/g, '').toUpperCase();

        if(!cleanedIban || cleanedIban.length < 15 || cleanedIban.length > 34) {
            return new InvalidIbanError(iban);
        }

        const countryCode = cleanedIban.slice(0, 2);
        const countryCodeRegex = /^[A-Z]{2}$/;

        const characterRegex = /^[A-Z0-9]+$/;


        if(!countryCodeRegex.test(countryCode)) {
            return new InvalidIbanError('Invalid country code in IBAN');
        }

        if(!characterRegex.test(cleanedIban)) {
            return new InvalidIbanError('IBAN contains invalid characters');
        }

        return new IbanValue(cleanedIban);

    }
    private constructor(public value: string) {}
}

