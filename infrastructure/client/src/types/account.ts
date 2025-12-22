export interface Account {
    accountNumber: number;
    iban: string;
    balance: number;
    accountType: string;
    accountStatus: string;
    isActive: boolean;
    userId: string;
    userName: string;
    createdAt: Date;
}
