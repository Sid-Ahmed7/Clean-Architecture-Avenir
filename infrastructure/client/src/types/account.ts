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
    customAccountName?: string;
    currency?: string;
}

export interface AccountCustom {
    accountNumber: number;
    iban: string;
    balance: number;
    accountType: string;
    accountStatus: string;
    isActive: boolean;
    userId: string;
    userName: string;
    createdAt: Date;
    customAccountName?: string;
    currency?: string;
}
