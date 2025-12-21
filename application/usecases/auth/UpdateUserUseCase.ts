import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class UpdateUserUseCase {
    public constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}

    public async execute(user: BankUserEntity) {
        const updatedUser = await this.userRepository.updateUser(user);

        if(updatedUser instanceof Error) {
            return updatedUser;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                user.id,
                `Votre profil a été mis à jour avec succès.`,
                NotificationTypeEnum.INFO
            );
        }

        return updatedUser;
    }
}