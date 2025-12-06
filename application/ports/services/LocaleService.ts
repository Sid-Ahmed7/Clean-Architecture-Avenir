export interface LocaleService {
    validate(locale?: string): string | Error;
    getDefault(): string;
}
