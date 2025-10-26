export interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    role?: "CLIENT" | "BANK_ADVISOR";
    locale?: string;
} 

export interface EmailService {
    sendEmail(options: SendEmailOptions) : Promise<void>;
}