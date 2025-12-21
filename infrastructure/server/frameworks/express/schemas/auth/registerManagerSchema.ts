import z from "zod";

export const registerManagerSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  dateOfBirth: z.coerce.date(),
  address: z.string(),
});