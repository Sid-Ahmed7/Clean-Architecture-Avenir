export type OverdraftRequest = {
    id: string;
    accountNumber: number;
    userId: string;
    currentOverdraftLimit: number;
    requestedOverdraftLimit: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
};

