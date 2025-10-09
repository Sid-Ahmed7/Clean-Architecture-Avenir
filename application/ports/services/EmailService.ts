export interface SendEmailOptions {
    to: string;
    subject: string;
    body: string;
} 

export interface EmailService {
    sendEmail(options: SendEmailOptions) : Promise<void>;
}