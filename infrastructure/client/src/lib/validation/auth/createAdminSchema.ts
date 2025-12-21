import z from "zod";

export const createAdminSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string(),
    lastName: z,
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    adminPassword: z.string()
  })

export type CreateAdminInput = z.infer<ReturnType<typeof createAdminSchema>>;
