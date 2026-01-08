import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import {EventBusInterface} from "../../ports/event/EventBusInterface";
import {UserConfirmedEvent} from "../../ports/event/UserConfirmedEvent";
import { EmailComposerService } from "../../ports/services/EmailComposerService";
import { LocaleService } from "../../ports/services/LocaleService";
export class ConfirmRegistrationUseCase {

    public constructor(private readonly userRepository: UserRepositoryInterface, private readonly localeService: LocaleService, private readonly emailService: EmailComposerService, private readonly eventBus: EventBusInterface){}

    public async execute(token: string, locale?: string): Promise<BankUserEntity | Error> {

        const user = await this.userRepository.findConfirmationToken(token);

        if(user instanceof Error) {
            return user;
        }


        const validatedLocale = this.localeService.validate(locale);
        if (validatedLocale instanceof Error) {
            return validatedLocale;
        }

        user.status = UserStatusEnum.ACTIVE;
        user.isRegistered = true;
        user.confirmationToken = undefined;
        user.confirmationTokenExpiresAt = undefined;

        const updatedUser = await this.userRepository.updateUser(user);

        if(updatedUser instanceof Error) {
            return updatedUser;
        }

        await this.emailService.sendSuccessfullyRegistrationConfirmation(
            updatedUser.email,
            updatedUser.firstName,
            validatedLocale
        );

        await this.eventBus.publish(new UserConfirmedEvent(updatedUser));

        return updatedUser;


    }

}
