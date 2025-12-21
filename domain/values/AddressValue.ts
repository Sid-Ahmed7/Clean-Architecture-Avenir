import { InvalidStreetError } from "../errors/InvalidStreetError";
import { InvalidCityError } from "../errors/InvalidCityError";
import { InvalidPostalCodeError } from "../errors/InvalidPostalCodeError";
import { InvalidCountryError } from "../errors/InvalidCountryError";

export class AddressValue {
  public static from(street: string,city: string,postalCode: string,country: string): AddressValue | InvalidStreetError |InvalidPostalCodeError | InvalidCountryError  {
    if (!street || street.trim().length === 0) {
      return new InvalidStreetError("Street cannot be empty");
    }

    if (!city || city.trim().length === 0) {
      return new InvalidCityError("City cannot be empty");
    }

    if (!postalCode || postalCode.trim().length === 0) {
      return new InvalidPostalCodeError("Postal code cannot be empty");
    }

    if (!country || country.trim().length === 0) {
      return new InvalidCountryError("Country cannot be empty");
    }

    return new AddressValue(
      street.trim(),
      city.trim(),
      postalCode.trim(),
      country.trim()
    );
  }

  private constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly country: string
  ) {}

  public toString(): string {
    return `${this.street}, ${this.postalCode} ${this.city}, ${this.country}`;
  }
}
