import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";

export class GetUserRolesUseCase {
    public constructor(private userRolesRepository: UserRoleRepositoryInterface){}

    public async execute(userId: string) {

        const roles = await this.userRolesRepository.findRolesByUserId(userId);

        if(roles instanceof Error) {
            return roles;
        }

        return roles;

    }
}