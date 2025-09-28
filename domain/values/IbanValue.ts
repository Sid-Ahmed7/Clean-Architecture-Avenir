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

        if(!IbanValue.isIbanValid(cleanedIban)) {
            return new InvalidIbanError("Invalid Iban");
        }

        return new IbanValue(cleanedIban);

    }

    public static generateIban(partialIban: string = ' '): IbanValue | InvalidIbanError {
        const ibanLength = 23;

        if(partialIban.length === ibanLength) {
            const ibanWithCheck = 'FR00' + partialIban;
            const checkDigits = IbanValue.calculateCheckDigits(ibanWithCheck);
            const fullIban = 'FR' + checkDigits + partialIban;

            const validatedIban = IbanValue.from(fullIban);
            if (validatedIban instanceof InvalidIbanError) {
                return new InvalidIbanError('Generated IBAN is invalid');
            }

            return validatedIban;
        }

        const randomDigits = Math.floor(Math.random() * 10).toString();
        const ibanWithNextDigit = partialIban + randomDigits;

        return IbanValue.generateIban(ibanWithNextDigit);
    }

    private constructor(public value: string) {}

    private static isIbanValid(iban: string) : boolean {
        const ibanForValidation = iban.slice(4) + iban.slice(0, 4);
        const numericIban = ibanForValidation.replace(/[A-Z]/g, char => (char.charCodeAt(0) - 55).toString());
        let remainder = numericIban;
        while(remainder.length > 2) {
            const block = remainder.slice(0,9);  
            remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
        }

        return parseInt(remainder, 10)% 97 === 1;
    }
        private static calculateCheckDigits(iban: string): string {
        const formattedIban = iban.slice(4) + iban.slice(0, 4);
        const numericIban = formattedIban.replace(/[A-Z]/g, char => (char.charCodeAt(0) - 55).toString());

        let remainder = numericIban;
        while (remainder.length > 2) {
            const block = remainder.slice(0, 9);
            remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
        }

        const mod97 = parseInt(remainder, 10) % 97;
        const checkDigits = (98 - mod97).toString().padStart(2, '0');
        return checkDigits;
    }





}

