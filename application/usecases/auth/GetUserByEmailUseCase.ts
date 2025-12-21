import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";

export class GetUserByEmailUseCase {

    public constructor(private readonly userRepository: UserRepositoryInterface){}


    public async execute(email: string) {

        const user = await this.userRepository.findByEmail(email);

        if(user instanceof Error) {
            return user;
        }

        return user;
    }
}