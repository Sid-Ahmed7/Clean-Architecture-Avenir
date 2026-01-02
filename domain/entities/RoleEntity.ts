import { RoleEnum } from "../enums/RoleEnum";

export class RoleEntity {

    private constructor(
        public id: string,
        public name: RoleEnum,
    ) {}

    public static from(id: string, name: RoleEnum): RoleEntity {
        return new RoleEntity(id, name);
    }
}