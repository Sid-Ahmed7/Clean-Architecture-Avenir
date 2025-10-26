import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";


export class GetAllAdvisorUseCase {
    public constructor(private roleRepository: RoleRepositoryInterface, private userRepository: UserRepositoryInterface, private useRoleRepository: UserRoleRepositoryInterface ) {}


    public async execute() {

        const advisorUsers: BankUserEntity[] = []

        const advisors = await this.roleRepository.findByName(RoleEnum.BANK_ADVISOR);
        if(advisors instanceof Error) {
            return advisors;
        }

        const allUsers = await this.userRepository.findAll();

        for(const user of allUsers) {
            const userRole = await this.useRoleRepository.findRolesByUserId(user.id);
            if(userRole instanceof Error) {
                return userRole
            }

            const hasAdvisorRole = userRole.some((r) => r.name === RoleEnum.BANK_ADVISOR);
            if(hasAdvisorRole) {
                advisorUsers.push(user);
            }
        }

        return advisorUsers;
    }
}