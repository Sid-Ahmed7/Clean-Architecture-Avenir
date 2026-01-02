import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RoleRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";


export class GetAllClientsUseCase {
    public constructor(
        private readonly roleRepository: RoleRepositoryInterface, 
        private readonly userRepository: UserRepositoryInterface, 
        private readonly userRoleRepository: UserRoleRepositoryInterface
    ) {}


    public async execute() {

        const clientUsers: BankUserEntity[] = []

        const clientRole = await this.roleRepository.findByName(RoleEnum.CLIENT);
        if(clientRole instanceof Error) {
            return clientRole;
        }

        const allUsers = await this.userRepository.findAll();

        for(const user of allUsers) {
            const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
            if(userRoles instanceof Error) {
                return userRoles;
            }

            const hasClientRole = userRoles.some((r) => r.name === RoleEnum.CLIENT);
            if(hasClientRole) {
                clientUsers.push(user);
            }
        }

        return clientUsers;
    }
}
