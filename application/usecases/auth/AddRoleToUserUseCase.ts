import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";

export class AddRoleToUserUseCase {

    public constructor(private userRoleRepository: UserRoleRepositoryInterface){}


    public async execute(userId: string, roleId: number) {

        const result = await this.userRoleRepository.addRoleToUser(userId, roleId);

        if(result instanceof Error) {
            return result;
        }
    }
}