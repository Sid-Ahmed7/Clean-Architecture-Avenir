export class InvalidAccountNumberError extends Error {
    
    public accountNumber: number;       

    constructor(accountNumber: number, message?: string) {
        super(message ?? `Invalid Account Number: "${accountNumber}"`);
        this.name = 'InvalidAccountNumberError';
        this.accountNumber = accountNumber;
    }
}