export interface EmailConfig {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}