export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
    status: string;
    isRegistered: boolean;
    createdAt: Date;
    roles?: string[];
}
