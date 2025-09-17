export class InvalidIbanError extends Error {
    
    public iban: string;

    constructor(iban: string, message?: string) {
        super(message ?? `Invalid IBAN: "${iban}"`);
        this.name = 'InvalidIbanError';
        this.iban = iban;
    }
}