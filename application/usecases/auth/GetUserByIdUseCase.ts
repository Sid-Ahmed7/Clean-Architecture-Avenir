import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";

export class GetUserByIdUseCase {

    public constructor(private userRepository: UserRepositoryInterface){}


    public async execute(userId: string) {

        const user = await this.userRepository.findById(userId);

        if(user instanceof Error) {
            return user;
        }

        return user;
    }
}