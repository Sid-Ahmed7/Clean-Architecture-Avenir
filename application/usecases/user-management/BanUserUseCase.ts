import { UserRepositoryInterface } from '../../ports/repositories/auth/UserRepositoryInterface';
import { UserStatusEnum } from '../../../domain/enums/UserStatusEnum';
import { UserAlreadyBanError } from './../../errors/UserAlreadyBanError';

export class BanUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(userId: string): Promise<void | Error> {
    const user = await this.userRepository.findById(userId);
    
    if (!user || user instanceof Error) {
      return new Error('User not found');
    }

    if (user.status === UserStatusEnum.BANNED) {
      return new UserAlreadyBanError('User is already banned');
    }

    user.status = UserStatusEnum.BANNED;

    const updatedUser = await this.userRepository.updateUser(user);
    if (updatedUser instanceof Error) {
      return updatedUser; 
    }
  }
}
