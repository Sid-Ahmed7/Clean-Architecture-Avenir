"use client";

import { useEffect, useState } from "react";
import { getOverdraftRequests } from "@/lib/api/account";
import { OverdraftRequest } from "@/types/overdraft";

export function useOverdraftRequests() {
    const [data, setData] = useState<OverdraftRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getOverdraftRequests()
            .then((res) => {
                setData(res.data);
                setError(null);
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? "Failed to load overdraft requests";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error, setData };
}

