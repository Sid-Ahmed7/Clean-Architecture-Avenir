import { UserRepositoryInterface } from '../../ports/repositories/auth/UserRepositoryInterface';
import { UserStatusEnum } from '../../../domain/enums/UserStatusEnum';

export class UnbanUserUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (!user || user instanceof Error) {
      throw new Error('Utilisateur non trouvé');
    }

    if (user.status !== UserStatusEnum.BANNED) {
      throw new Error('Cet utilisateur n\'est pas banni');
    }

    user.status = UserStatusEnum.ACTIVE;
    await this.userRepository.updateUser(user);
  }
}
