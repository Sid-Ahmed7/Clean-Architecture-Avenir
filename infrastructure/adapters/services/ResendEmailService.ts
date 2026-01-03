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
    let toAddress = "delivered@resend.dev"; 

    if (options.role === "CLIENT") {
      toAddress = "delivered+client@resend.dev";
    } else if (options.role === "BANK_ADVISOR") {
      toAddress = "delivered+advisor@resend.dev";
    }

    await this.resend.emails.send({
      from: "Banque Avenir <onboarding@resend.dev>",
      to: toAddress,
      subject: options.subject,
      html: textHtml,
    });
    console.log("Contenu du mail :", options.text);

    console.log(`✉️ [SANDBOX] Email envoyé à ${toAddress}`);
  }
}
