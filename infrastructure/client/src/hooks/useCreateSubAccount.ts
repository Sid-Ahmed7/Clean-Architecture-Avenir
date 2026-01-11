import { useState } from "react";
import { CreateSubAccountModel } from "../lib/validation/bankAccount/createSubAccountSchema";
import { responseSubAccountSchema } from "../lib/validation/bankAccount/responseSubAccountSchema";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { addSubAccount } from "../lib/api/account";

export function useCreateSubAccount() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSubAccount = (data: CreateSubAccountModel) => {
    setLoading(true);
    setError(null);
    setSuccess(false);


      addSubAccount(data)
      .then((res) => {
        const parsed =  responseSubAccountSchema(t).safeParse(res.data);
        if(!parsed.success) {
            setError(t("generalErrors.userAccounts.validation"));
            return;
        }
        setSuccess(true);
        router.push("/client/dashboard");
        return res.data;
      })
      .catch((err) => {
        setError(err.response.data.message || t("errors.accountLoad"));

      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    createSubAccount,
    loading,
    error,
    success,
  };
}
