import { EmailService, SendEmailOptions } from "../../../application/ports/services/EmailService";
import { EmailComposerService } from "../../../application/ports/services/EmailComposerService";

type SupportedLocale = "en" | "fr";

const emailTranslations = {
  en: {
    registration: {
      subject: "Confirm your registration to our bank",
      greeting: (firstName: string) => `Hello ${firstName},`,
      body: (url: string) => `Please confirm your registration by clicking on this link:\n${url}`,
      expiry: (expiresAt: Date) => `This link will expire on ${expiresAt.toISOString()}.`,
    },
    registrationSuccess: {
      subject: "Registration confirmed! 🎉",
      body: (firstName: string) => `Hello ${firstName},\n\nYour account has been successfully activated! You can now log in and access your bank accounts.`,
    },
  },
  fr: {
    registration: {
      subject: "Confirmez votre inscription à notre banque",
      greeting: (firstName: string) => `Bonjour ${firstName},`,
      body: (url: string) => `Veuillez confirmer votre inscription en cliquant sur ce lien :\n${url}`,
      expiry: (expiresAt: Date) => `Ce lien expirera le ${expiresAt.toISOString()}.`,
    },
    registrationSuccess: {
      subject: "Inscription confirmée ! 🎉",
      body: (firstName: string) => `Bonjour ${firstName},\n\nVotre compte a été activé avec succès ! Vous pouvez maintenant vous connecter et accéder à vos comptes bancaires.`,
    },
  },
};

export class EmailTemplateService implements EmailComposerService {
  constructor(private readonly emailService: EmailService, private readonly baseUrl: string) {}

  async sendRegistrationConfirmation(
    to: string,
    firstName: string,
    token: string,
    expiresAt: Date,
    role: "CLIENT" | "BANK_ADVISOR" | "BANK_MANAGER",
    locale: string = "en"
  ) {
    const validLocale: SupportedLocale = (locale === "fr" || locale === "en") ? locale : "en";

    const translations = emailTranslations[validLocale].registration;
    const url = `${this.baseUrl}/${validLocale}/confirm?token=${token}`;

    const text = `${translations.greeting(firstName)}\n\n${translations.body(url)}\n\n${translations.expiry(expiresAt)}`;

    const options: SendEmailOptions = {
      to,
      subject: translations.subject,
      text,
      role,
      locale: validLocale
    };


    await this.emailService.sendEmail(options);
  }

  async sendSuccessfullyRegistrationConfirmation( to: string,firstName: string,locale: string = "en") {
    const validLocale: SupportedLocale = (locale === "fr" || locale === "en") ? locale : "en";
    const translations = emailTranslations[validLocale].registrationSuccess;
    const text = translations.body(firstName);
    const options: SendEmailOptions = {
      to,
      subject: translations.subject,
      text,
      locale: validLocale
    };
    await this.emailService.sendEmail(options);
  }
}
