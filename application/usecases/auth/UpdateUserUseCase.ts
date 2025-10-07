import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";

export class UpdateUserUseCase {
    public constructor(private userRepository: UserRepositoryInterface){}

    public async execute(user: BankUserEntity) {
        const updatedUser = await this.userRepository.updateUser(user);

        if(updatedUser instanceof Error) {
            return updatedUser;
        }
        return updatedUser;
    }
}