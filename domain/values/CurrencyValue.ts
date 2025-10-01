import { InvalidCurrencyError } from "../errors/InvalidCurrencyError";

export class CurrencyValue {
    private static ALL_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
    public static from(currency: string) {

        if(!currency || currency.trim().length !== 3) {
            return new InvalidCurrencyError("Currency must be a 3-letter code.");
        }

        const formattedCurrency = currency.trim().toUpperCase();

        if(!this.ALL_CURRENCIES.includes(formattedCurrency)) {
            return new InvalidCurrencyError(`Currency ${formattedCurrency} not supported .`);
        }
        return new CurrencyValue(formattedCurrency);
    }

    private constructor(public value: string) {}


        

    }