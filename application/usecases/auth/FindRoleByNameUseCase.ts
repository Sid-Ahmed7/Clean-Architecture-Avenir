import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";

export class FindRolesByNameUseCase {

    public constructor(private roleRepository: RoleRepositoryInterface){}

    public async execute(name: RoleEnum) {

        const roleOrError = await this.roleRepository.findByName(name);
        if(roleOrError instanceof Error) {
            return roleOrError;
        }
        return roleOrError;
    }
}