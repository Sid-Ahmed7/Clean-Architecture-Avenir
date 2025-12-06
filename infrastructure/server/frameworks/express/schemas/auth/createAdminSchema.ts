import z from "zod";

export const createAdminSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  dateOfBirth: z.coerce.date(),
  address: z.string(),
  adminPassword: z.string().optional(),
});