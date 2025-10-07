import { PermissionEnum } from "../enums/PermissionEnum";

export class PermissionEntity {
    private constructor(
        public id: number,
        public name: PermissionEnum,
    ) {}
}