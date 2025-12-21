import { LocaleService } from "../../../application/ports/services/LocaleService";
import { LocaleValue } from "../../../domain/values/LocaleValue";

export class LocaleValidationService implements LocaleService {

    public validate(locale?: string): string | Error {
        const localeValue = LocaleValue.create(locale);
        if (localeValue instanceof Error) {
            return localeValue;
        }
        return localeValue.value;
    }

    public getDefault(): string {
        return 'en';
    }
}
