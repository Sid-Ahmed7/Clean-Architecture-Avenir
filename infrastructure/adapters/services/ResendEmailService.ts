import { EmailService, SendEmailOptions } from "../../../application/ports/services/EmailService";
import { Resend } from "resend";

export class ResendEmailService implements EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendEmail(options: SendEmailOptions): Promise<void> {
        await this.resend.emails.send({
            from: "Banque Avenir <no-reply@banque-avenir.com>",
            to: options.to,
            subject: options.subject,
            text: options.text,
        });
    }
}
