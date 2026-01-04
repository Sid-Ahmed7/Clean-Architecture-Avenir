import { Resend } from "resend";

// Validation de la clé API Resend
if (!process.env.RESEND_API_KEY) {
  console.error("⚠️ RESEND_API_KEY est manquante dans les variables d'environnement");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "");

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "Avenir Contact <onboarding@resend.dev>",
  to: process.env.EMAIL_TO || "delivered@resend.dev",
} as const;