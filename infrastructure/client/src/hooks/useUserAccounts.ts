import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { AccountModel, accountSchema } from "../lib/validation/bankAccount/accountSchema";
import { apiClient } from "../lib/api/apiClient";
import z from "zod";
import { getAccounts } from "../lib/api/account";

export const useUserAccounts = () => {
    const t = useTranslations();
    const [accounts, setAccounts] = useState<AccountModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAccounts = () => {
        setLoading(true);

        getAccounts().then((res) => {
            const parsed = z.array(accountSchema(t)).safeParse(res.data);

                if (!parsed.success) {
                    setError("Erreur compte");
                    return;
                }

                setAccounts(parsed.data);
                setError(null);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || t("errors.accountLoad"));
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAccounts();
    }, [t]);

    return { accounts, loading, error, reload: loadAccounts };
}