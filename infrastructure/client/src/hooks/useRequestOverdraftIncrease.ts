"use client";

import { useCallback, useState } from "react";
import { requestOverdraftIncrease } from "@/lib/api/account";

export function useRequestOverdraftIncrease() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = useCallback((accountNumber: number, overdraftLimit: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        return requestOverdraftIncrease(accountNumber, overdraftLimit)
            .then(() => {
                setSuccess(true);
                return true;
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? " Request overdraft increase failed";
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
        submit,
        loading,
        error,
        success,
        resetState,
    };
}

