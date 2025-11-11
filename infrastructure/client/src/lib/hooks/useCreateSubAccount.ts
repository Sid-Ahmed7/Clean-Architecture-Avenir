import { useState } from "react";
import { ResponseSubAccountModel, responseSubAccountSchema } from "../validation/bankAccount/responseSubAccountSchema";
import z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { addSubAccount } from "../api/account";

export function useCreateSubAccount() {
  const t = useTranslations();  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSubAccount = (data: ResponseSubAccountModel) => {
    setLoading(true);
    setError(null);
    setSuccess(false);


      addSubAccount(data)
      .then((res) => {
        const parsed =  responseSubAccountSchema(t).safeParse(res.data);
        if(!parsed.success) {
            setError("Erreur compte");
            return;
        }
        setSuccess(true);
        router.push("/dashboard");
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
