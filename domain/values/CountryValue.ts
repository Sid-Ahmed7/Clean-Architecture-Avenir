import { InvalidCountryCodeError } from "../errors/InvalidCountryCodeError";

export class CountryValue {
  private static readonly VALID_COUNTRIES = ["FR"];

  public static from(countryCode: string): CountryValue | InvalidCountryCodeError {
    if (!countryCode || countryCode.trim().length === 0) {
      return new InvalidCountryCodeError("Country code cannot be empty");
    }

    const upperCode = countryCode.trim().toUpperCase();

    if (upperCode.length !== 2) {
      return new InvalidCountryCodeError("Country code must be 2 characters");
    }

    if (!this.VALID_COUNTRIES.includes(upperCode)) {
      return new InvalidCountryCodeError(`Country code ${upperCode} is not supported`);
    }

    return new CountryValue(upperCode);
  }

  private constructor(public readonly value: string) {}
}
