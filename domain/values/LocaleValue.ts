import { InvalidLocaleError } from "../errors/InvalidLocaleError";

type AllowedLocale = 'en' | 'fr';

export class LocaleValue {
  public readonly value: AllowedLocale;
  private static readonly ALLOWED_LOCALES: readonly AllowedLocale[] = ['en', 'fr'];

  private constructor(locale: AllowedLocale) {
    this.value = locale;
  }

  public static create(locale?: string): LocaleValue | Error {
    const normalizedLocale = locale?.toLowerCase().trim();

    if (!normalizedLocale) {
      return new LocaleValue('en');
    }

    if (!this.ALLOWED_LOCALES.includes(normalizedLocale as AllowedLocale)) {
      return new InvalidLocaleError(
        `Invalid locale: ${locale}. Allowed values are: ${this.ALLOWED_LOCALES.join(', ')}`
      );
    }

    return new LocaleValue(normalizedLocale as AllowedLocale);
  }
}
