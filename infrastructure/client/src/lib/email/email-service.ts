import { ContactEmailData, EmailResponse } from "@/types/email";
import { resend, EMAIL_CONFIG } from "./resend";
import { generateContactEmailHTML } from "./templates/contact-email";

export class EmailService {

  static async sendContactEmail(data: ContactEmailData): Promise<EmailResponse> {
    try {
      const html = generateContactEmailHTML(data);

      const { data: emailData, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to,
        replyTo: data.email,
        subject: `Nouveau message: ${data.subject}`,
        html,
      });

      if (error) {
        console.error("Erreur Resend:", error);
        return {
          success: false,
          error: error.message || "Erreur lors de l'envoi de l'email",
        };
      }

      return {
        success: true,
        id: emailData?.id,
      };
    } catch (error) {
      console.error("Erreur inattendue lors de l'envoi:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

 
  static validateConfig(): boolean {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquante");
      return false;
    }
    if (!process.env.EMAIL_TO) {
      console.error("EMAIL_TO manquante");
      return false;
    }
    return true;
  }
}