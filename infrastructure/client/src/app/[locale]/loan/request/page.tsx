"use client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import Button from "@/components/ui/Button";
import { createLoanRequest } from "@/lib/api/loan";
import {
  CreateLoanRequestInput,
  createLoanRequestSchema,
} from "@/lib/validation/loan/createLoanRequestSchema";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { getAllAdvisors } from "@/lib/api/auth";

type AdvisorOption = { id: string; fullName: string };

function LoanRequestPage() {
  const t = useTranslations();
  const { locale } = useContext(LocaleContext);
  const [message, setMessage] = useState("");
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([]);
  const [loadingAdvisors, setLoadingAdvisors] = useState(true);
  const [advisorError, setAdvisorError] = useState("");

  useEffect(() => {
    getAllAdvisors()
      .then((list) => {
        const options = list.map((a: any) => ({
          id: a.id,
          fullName: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() || a.email || a.id,
        }));
        setAdvisors(options);
        if (options.length > 0) {
          setValue("advisorId", options[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load advisors", err);
        setAdvisorError(err.response?.data?.error || "Impossible de charger les conseillers");
      })
      .finally(() => setLoadingAdvisors(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateLoanRequestInput>({
    resolver: zodResolver(createLoanRequestSchema(t)),
    defaultValues: {
      advisorId: "",
      amount: 0,
      purpose: "",
    },
  });

  const onSubmit = (data: CreateLoanRequestInput) => {
    createLoanRequest(data)
      .then((res) => {
        if (res.status === 201) {
          setMessage("Demande envoyée au conseiller");
          reset();
          return;
        }
        setMessage("Échec de la demande");
      })
      .catch((error) => {
        console.error("Loan request error:", error);
        setMessage(error.response?.data?.error || "Erreur lors de la demande");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-xl border border-gray-200"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
          Demande de crédit
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900" htmlFor="advisorId">
            Choisir un conseiller
          </label>
          {loadingAdvisors ? (
            <p className="text-sm text-gray-600">Chargement des conseillers...</p>
          ) : advisorError ? (
            <p className="text-sm text-red-600">{advisorError}</p>
          ) : (
            <select
              id="advisorId"
              {...register("advisorId")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
            >
              {advisors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName}
                </option>
              ))}
            </select>
          )}
          {errors.advisorId && <p className="text-red-500 mt-1">{errors.advisorId.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900" htmlFor="amount">
            Montant demandé
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
          />
          {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-900" htmlFor="purpose">
            Motif
          </label>
          <textarea
            id="purpose"
            {...register("purpose")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            rows={3}
          />
          {errors.purpose && <p className="text-red-500 mt-1">{errors.purpose.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Envoyer la demande
        </Button>

        {message && <p className="text-center text-sm text-gray-700 mt-4">{message}</p>}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Une fois envoyée, la demande sera visible par votre conseiller.
        </p>
      </form>
    </div>
  );
}

export default withClientProtection("/login")(LoanRequestPage);

