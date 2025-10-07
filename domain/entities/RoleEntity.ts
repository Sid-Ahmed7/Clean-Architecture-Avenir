import { RoleEnum } from "../enums/RoleEnum";

export class RoleEntity {

    private constructor(
        public id: number,
        public name: RoleEnum,
    ) {}
}