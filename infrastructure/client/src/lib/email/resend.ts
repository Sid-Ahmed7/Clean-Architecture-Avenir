import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY est manquante dans les variables d'environnement");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: "Banque Avenir Contact <" + (process.env.EMAIL_FROM),
  to: "Banque Avenir Contact <" + (process.env.TO),
} as const;