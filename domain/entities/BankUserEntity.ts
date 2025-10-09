import { UserStatusEnum } from "../enums/UserStatusEnum";
import { EmailValue } from "../values/EmailValue";
import { PasswordValue } from "../values/PasswordValue";

export class BankUserEntity {
    public static from(email: string, password: string, status: UserStatusEnum, firstName: string, lastName: string, phoneNumber: string, dateOfBirth: Date, address: string, isRegistered?: boolean, resetPasswordToken?: string, resetTokenExpiresAt?: Date, id?: string, createdAt?: Date) {

        const validatedEmail = EmailValue.from(email);

        if(validatedEmail instanceof Error) {
            return validatedEmail;
        }

        const validatedPassword = PasswordValue.from(password);
        if(validatedPassword instanceof Error) {
            return validatedPassword;
        }

        return new BankUserEntity(id ?? crypto.randomUUID(), validatedEmail.value, validatedPassword.value, status, firstName, lastName, phoneNumber, dateOfBirth, address, isRegistered ?? false, resetPasswordToken, resetTokenExpiresAt, createdAt ?? new Date());
        

    }

        private constructor(
            public id: string,
            public email: string,
            public password: string,
            public status: UserStatusEnum,
            public firstName: string,
            public lastName: string,
            public phoneNumber: string,
            public dateOfBirth: Date,
            public address: string,
            public isRegistered: boolean,
            public resetPasswordToken?: string,
            public resetTokenExpiresAt?: Date,
            public createdAt?: Date
            
        ){}


        
}