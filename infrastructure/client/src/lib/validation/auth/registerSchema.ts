import z from "zod";

export const registerSchema = (t:(key: string) => string) =>

z.object({
  firstName: z
    .string()
    .min(1, { message: t("errors.firstName") })
    .max(50, { message: t("errors.firstName") }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z
    .email( t("errors.email.required")),
  password: z
    .string()
    .min(8, { message: t("errors.password.minLength") })
    .max(128, { message: t("errors.password.maxLength") })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: t("errors.password.regex") }),
    confirmPassword: z.string().min(8, { message: t("errors.password.minLength") })
    }).refine((data) => data.password === data.confirmPassword, {
    message: t("errors.confirmPassword.mismatch"),
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<ReturnType<typeof registerSchema>>;
