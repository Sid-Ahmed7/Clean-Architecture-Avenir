export interface EmailComposerService {
  sendRegistrationConfirmation(
    to: string,
    firstName: string,
    token: string,
    expiresAt: Date,
    role: "CLIENT" | "BANK_ADVISOR" | "BANK_MANAGER",
    locale?: string
  ): Promise<void>;
}
