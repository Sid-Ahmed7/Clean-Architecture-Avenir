import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { AccountModel, accountSchema } from "../validation/bankAccount/accountSchema";
import { apiClient } from "../api/apiClient";
import z from "zod";

export const useUserAccounts = () => {
    const t = useTranslations();
    const [accounts, setAccounts] = useState<AccountModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        setLoading(true);

        apiClient.get("/accounts/my-accounts").then((res) => {
            const parsed = z.array(accountSchema(t)).safeParse(res.data);

            if(!parsed.success) {
                      console.error("Zod parsing errors:", parsed.error.format());

                setError("Erreur compte");
                return;
            }


            setAccounts(parsed.data);
        })
        .catch((err) => {
            setError(err.response.data.message || t("errors.accountLoad"));
        }) 
        .finally(() => setLoading(false));
    }, [t]);

    return {accounts, loading, error};
}