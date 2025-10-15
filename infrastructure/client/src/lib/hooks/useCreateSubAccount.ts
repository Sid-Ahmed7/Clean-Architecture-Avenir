"use client";

import { useState } from "react";
import { CreateSubAccountModel, createSubAccountSchema } from "../validation/bankAccount/createSubAccountSchema";
import { apiClient } from "../api/apiClient";
import z from "zod";
import { useTranslations } from "next-intl";

export function useCreateSubAccount() {
  const t = useTranslations();  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSubAccount = (data: CreateSubAccountModel) => {
    setLoading(true);
    setError(null);
    setSuccess(false);


    apiClient.post("/accounts/create/sub", data)
      .then((res) => {
        const parsed = z.array(createSubAccountSchema(t)).safeParse(res.data);
        if(!parsed.success) {
            setError("Erreur compte");
            return;
        }
        setSuccess(true);
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
