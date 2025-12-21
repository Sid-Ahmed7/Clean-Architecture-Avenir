import z from "zod";
import { AccountStatusEnum } from "../../../../../../domain/enums/AccountStatusEnum";

export const changeAccountStatusSchema = z.object({
    status: z.enum(AccountStatusEnum),
});