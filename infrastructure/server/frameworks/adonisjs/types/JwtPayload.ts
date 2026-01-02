import { RoleEnum } from "../../../../../../domain/enums/RoleEnum.js";

export interface JwtPayload {
  sub: string;
  roles:RoleEnum[]
}

export interface AuthContext {
  userId: string
  roles: RoleEnum[]
}
