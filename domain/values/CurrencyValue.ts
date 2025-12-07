import { InvalidCurrencyError } from "../errors/InvalidCurrencyError";

export class CurrencyValue {
    private static ALL_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
    public static from(currency: string): CurrencyValue | InvalidCurrencyError {

        if(!currency || currency.trim().length !== 3) {
            return new InvalidCurrencyError(`Currency must be a 3-letter code: ${currency}`);
        }

        const formattedCurrency = currency.trim().toUpperCase();

        if(!this.ALL_CURRENCIES.includes(formattedCurrency)) {
            return new InvalidCurrencyError(`Currency not supported: ${formattedCurrency}`);
        }
        return new CurrencyValue(formattedCurrency);
    }

    private constructor(public readonly value: string) {}


        

    }