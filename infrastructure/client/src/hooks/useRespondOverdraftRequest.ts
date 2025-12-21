"use client";

import { useCallback, useState } from "react";
import { respondOverdraftRequest } from "@/lib/api/account";

export function useRespondOverdraftRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const respond = useCallback((requestId: string, action: "APPROVE" | "REJECT") => {
        setLoading(true);
        setError(null);
        return respondOverdraftRequest(requestId, action)
            .then(() => true)
            .catch((err) => {
                const message = err?.response?.data?.error ?? "Réponse impossible";
                setError(message);
                return false;
            })
            .finally(() => setLoading(false));
    }, []);

    return { respond, loading, error };
}

