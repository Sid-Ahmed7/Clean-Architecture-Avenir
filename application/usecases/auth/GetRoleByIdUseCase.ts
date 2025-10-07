import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";

export class GetRoleByIdUseCase {

    public constructor(private roleRepository: RoleRepositoryInterface){}

    public async execute(id: number) {

        const roleOrError = await this.roleRepository.findById(id);
        if(roleOrError instanceof Error) {
            return roleOrError;
        }
        return roleOrError;
    }
}