import { EmailService, SendEmailOptions } from "../../../application/ports/services/EmailService";
import { EmailComposerService } from "../../../application/ports/services/EmailComposerService";

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
    const url = `${this.baseUrl}/${locale}/confirm?token=${token}`;

    const text = `Bonjour ${firstName},\n\nVeuillez confirmer votre inscription en cliquant sur ce lien : 
${url}\n\nCe lien expirera le ${expiresAt.toISOString()}.`;

    const options: SendEmailOptions = {
      to,
      subject: "Confirmez votre inscription à notre banque",
      text,
      role,
      locale
    };

    console.log("Email à envoyer :", JSON.stringify(options, null, 2));

    await this.emailService.sendEmail(options);
  }
}
