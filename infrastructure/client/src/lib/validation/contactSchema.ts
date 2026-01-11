import { z } from "zod";

export const contactSchemaServer  = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const contactSchema = (t: (key:string) =>string) => z.object({
  name: z.string().min(2, t('errors.nameMin')),
  email: z.string().email(t('errors.emailInvalid')),
  subject: z.string().min(2, t('errors.subjectMin')),
  message: z.string().min(10, t('errors.messageMin')),
});

export type ContactFormData = z.infer<typeof contactSchemaServer>;
