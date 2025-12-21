import { BankUserEntity } from "../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../domain/enums/RoleEnum";

export interface RefreshTokenResponse {
    accessToken: string;
    user: BankUserEntity;
    roles: RoleEnum[];
}
