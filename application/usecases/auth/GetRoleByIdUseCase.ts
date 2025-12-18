import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RoleRepositoryInterface";

export class GetRoleByIdUseCase {

    public constructor(private readonly roleRepository: RoleRepositoryInterface){}

    public async execute(id: string) {

        const roleOrError = await this.roleRepository.findById(id);
        if(roleOrError instanceof Error) {
            return roleOrError;
        }
        return roleOrError;
    }
}