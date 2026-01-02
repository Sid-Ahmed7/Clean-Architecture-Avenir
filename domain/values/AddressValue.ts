import { InvalidStreetError } from "../errors/InvalidStreetError";
import { InvalidCityError } from "../errors/InvalidCityError";
import { InvalidPostalCodeError } from "../errors/InvalidPostalCodeError";

export class AddressValue {
  public static from(street: string, city: string, postalCode: string): AddressValue | InvalidStreetError | InvalidCityError | InvalidPostalCodeError {
    if (!street || street.trim().length === 0) {
      return new InvalidStreetError("Street cannot be empty");
    }

    if (!city || city.trim().length === 0) {
      return new InvalidCityError("City cannot be empty");
    }

    if (!postalCode || postalCode.trim().length === 0) {
      return new InvalidPostalCodeError("Postal code cannot be empty");
    }

    return new AddressValue(
      street.trim(),
      city.trim(),
      postalCode.trim()
    );
  }

  private constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string
  ) {}

  public toString(): string {
    return `${this.street}, ${this.postalCode} ${this.city}`;
  }
}
