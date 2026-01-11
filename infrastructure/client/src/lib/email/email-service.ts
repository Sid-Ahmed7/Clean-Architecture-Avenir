
import { ContactEmailData, EmailResponse } from "@/types/email";
import { resend, EMAIL_CONFIG } from "./resend";
import { generateContactEmailHTML } from "./templates/contact-email";
import { getTranslations } from "next-intl/server";

export class EmailService {

  static async sendContactEmail(data: ContactEmailData): Promise<EmailResponse> {
    const t = await getTranslations("generalErrors.emailErrors");
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
        console.error(t("resend"), error);
        return {
          success: false,
          error: error.message || t("send"),
        };
      }

      return {
        success: true,
        id: emailData?.id,
      };
    } catch (error) {
      console.error(t("unexpected"), error);
      return {
        success: false,
        error: error instanceof Error ? error.message : t("unknown"),
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