import { UserNoBanError } from "../../errors/UserNoBanError";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";

export class UnbanUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(userId: string): Promise<void | Error> {
    const user = await this.userRepository.findById(userId);
    
    if (!user || user instanceof Error) {
      return new Error('User not found');
    }

    if (user.status !== UserStatusEnum.BANNED) {
      return new UserNoBanError('User is not banned');
    }

    user.status = UserStatusEnum.ACTIVE;

    const updatedUser  = await this.userRepository.updateUser(user);
    if( updatedUser instanceof Error) {
      return updatedUser;
    }
  }
}
