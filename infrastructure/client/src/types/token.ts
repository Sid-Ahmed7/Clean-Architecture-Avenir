
import { RoleEnum } from './RoleEnum';

export interface Token {
  userId: string;
  role: RoleEnum | string;
}
