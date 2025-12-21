import z from "zod";

export const createAdvisorSchema = (t:(key: string) => string) =>

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
  phoneNumber: z
    .string()
    .min(1, "Phone number is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),
  address: z
    .string()
    .min(1, "Address is required")
});

export type CreateAdvisorInput = z.infer<ReturnType<typeof createAdvisorSchema>>;
