import { UserStatusEnum } from './PostgresEnums';

export interface PostgresBankUserRow {
    id: string;
    email: string;
    password: string;
    status: UserStatusEnum;
    first_name: string;
    last_name: string;
    phone_number: string;
    date_of_birth: Date;
    address: string;
    is_registered: boolean;
    confirmation_token: string | null;
    confirmation_token_expires_at: Date | null;
    reset_password_token: string | null;
    reset_token_expires_at: Date | null;
    created_at: Date;
}
