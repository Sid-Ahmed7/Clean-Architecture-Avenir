import z from "zod";

export const loginSchema = (t:(key: string) => string) =>

 z.object({
    email: z
        .email({ message: t("errors.email.invalid")}),
    password: z
        .string()
        .min(8, { message: t("errors.password.minLength") })
        .max(128, { message: t("errors.password.maxLength") })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: t("errors.password.regex") }),

    
})
export type LoginInput = z.infer<ReturnType<typeof loginSchema>>;
