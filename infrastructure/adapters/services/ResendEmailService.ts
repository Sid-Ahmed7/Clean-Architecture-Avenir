import { EmailService, SendEmailOptions } from "../../../application/ports/services/EmailService";
import { Resend } from "resend";

export class ResendEmailService implements EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const textHtml = `<p>${options.text?.replace(/\n/g, "<br>")}</p>`;
    console.log("Role vaut", options.role);

    await this.resend.emails.send({
      from: "Banque Avenir <" + process.env.EMAIL_FROM + ">",
      to: options.to,
      subject: options.subject,
      html: textHtml,
    });
    console.log("Contenu du mail :", options.text);

    console.log(`✉️ Email envoyé à ${options.to}`);
  }
}
