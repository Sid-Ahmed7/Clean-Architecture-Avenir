import { useTranslations } from "next-intl"
import { useContext, useEffect, useState } from "react";
import { AccountModel, accountSchema } from "../lib/validation/bankAccount/accountSchema";
import z from "zod";
import { getAccounts } from "../lib/api/account";
import { AuthContext } from "../contexts/AuthProvider";
import { RoleEnum } from "../types/RoleEnum";

export const useUserAccounts = () => {
    const t = useTranslations();
    const { hasAnyRole, isAuthenticated } = useContext(AuthContext);
    const [accounts, setAccounts] = useState<AccountModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated === undefined) {
            return;
        }

        setLoading(true);

        getAccounts()
            .then((res) => {
                const parsed = z.array(accountSchema(t)).safeParse(res.data);

                if (!parsed.success) {
                    setError(t('generalErrors.userAccounts.account'));
                    return;
                }

                setAccounts(parsed.data);
                setError(null);
            })
            .catch((err) => {
                setError(err.response?.data?.message || t("errors.accountLoad"));
            })
            .finally(() => setLoading(false));
    }, [t, hasAnyRole, isAuthenticated]);

    return { accounts, loading, error };
}
