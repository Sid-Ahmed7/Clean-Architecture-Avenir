"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { respondOverdraftRequest } from "@/lib/api/account";

export function useRespondOverdraftRequest() {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const respond = useCallback((requestId: string, action: "APPROVE" | "REJECT") => {
        setLoading(true);
        setError(null);
        return respondOverdraftRequest(requestId, action)
            .then(() => true)
            .catch((err) => {
                const message = err?.response?.data?.error ?? t('generalErrors.overdraft.failed');
                setError(message);
                return false;
            })
            .finally(() => setLoading(false));
    }, []);

    return { respond, loading, error };
}

