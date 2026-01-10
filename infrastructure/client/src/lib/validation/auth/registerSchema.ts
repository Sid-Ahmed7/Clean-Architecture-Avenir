import z from "zod";

export const registerSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, { message: t("errors.firstName") })
        .max(50, { message: t("errors.firstName") }),
      lastName: z
        .string()
        .min(1, { message: t('errors.lastName.required') })
        .max(50, { message: t('errors.lastName.tooLong') }),
      email: z.string().email({ message: t("errors.email.required") }),
      password: z
        .string()
        .min(8, { message: t("errors.password.minLength") })
        .max(128, { message: t("errors.password.maxLength") })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: t("errors.password.regex") }),
      confirmPassword: z
        .string()
        .min(8, { message: t("errors.password.minLength") }),
      phoneNumber: z.string().min(1, { message: t('errors.phoneNumber.required') }),
      dateOfBirth: z.string().min(1, { message: t('errors.dateOfBirth.required') }),
      address: z.string().min(1, { message: t('errors.address.required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<ReturnType<typeof registerSchema>>;
