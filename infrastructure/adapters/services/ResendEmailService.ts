import { EmailService, SendEmailOptions } from "../../../application/ports/services/EmailService";
import { Resend } from "resend";

export class ResendEmailService implements EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendEmail(options: SendEmailOptions): Promise<void> {
        const textHtml = `<p>${options.text?.replace(/\n/g, "<br>")}</p>`;

        await this.resend.emails.send({
            from: "Banque Avenir <onboarding@resend.dev>",
            to: options.to,
            subject: options.subject,
            text: textHtml,
        });
    }
}
