"use client";

import { useCallback, useState } from "react";
import { updateTransferLimit } from "@/lib/api/account";

export function useUpdateTransferLimit() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const update = useCallback((accountNumber: number, transferLimit: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        return updateTransferLimit(accountNumber, transferLimit)
            .then(() => {
                setSuccess(true);
                return true;
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? "update transfer limit failed";
                setError(message);
                return false;
            })
            .finally(() => setLoading(false));
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {
        update,
        loading,
        error,
        success,
        resetState,
    };
}

