import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { EmailService } from "../../ports/services/EmailService";
import {EventBusInterface} from "../../ports/event/EventBusInterface";
import {UserConfirmedEvent} from "../../../domain/events/UserConfirmedEvent";
export class ConfirmRegistrationUseCase {

    public constructor(private userRepository: UserRepositoryInterface, private emailService: EmailService, private eventBus: EventBusInterface){}

    public async execute(token: string): Promise<BankUserEntity | Error> {

        const user = await this.userRepository.findConfirmationToken(token);

        if(user instanceof Error) {
            return user;
        }

        user.status = UserStatusEnum.ACTIVE;
        user.isRegistered = true;
        user.confirmationToken = undefined;
        user.confirmationTokenExpiresAt = undefined;

        const updatedUser = await this.userRepository.updateUser(user);

        if(updatedUser instanceof Error) {
            return updatedUser;
        }

        await this.emailService.sendEmail({
            to: updatedUser.email,
            subject: "Inscription confirmée ! 🎉",
            text: `Bonjour ${updatedUser.firstName},\n\nVotre compte a été activé avec succès ! Vous pouvez maintenant vous connecter et acceder à vos comptes bancaires.`

        })

        await this.eventBus.publish(new UserConfirmedEvent(updatedUser));

        return updatedUser;


    }

}
