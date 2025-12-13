"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { LocaleContext } from "@/contexts/LocaleProvider";
import Button from "@/components/ui/Button";
import { createLoanRequest, getIndicativeRate } from "@/lib/api/loan";
import {
  CreateLoanRequestInput,
  createLoanRequestSchema,
} from "@/lib/validation/loan/createLoanRequestSchema";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { getAllAdvisors } from "@/lib/api/auth";

type AdvisorOption = { id: string; fullName: string };
const DURATIONS = [6, 12, 18];
const RATE_THRESHOLD = 5000;

function LoanRequestPage() {
  const t = useTranslations();
  const { locale } = useContext(LocaleContext);
  const [message, setMessage] = useState("");
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([]);
  const [loadingAdvisors, setLoadingAdvisors] = useState(true);
  const [advisorError, setAdvisorError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [indicativeRate, setIndicativeRate] = useState<number | null>(null);

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

    getIndicativeRate()
      .then((rate) => setIndicativeRate(rate))
      .catch((err) => {
        console.error("Failed to load indicative rate", err);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateLoanRequestInput>({
    resolver: zodResolver(createLoanRequestSchema(t)),
    defaultValues: {
      advisorId: "",
      amount: 0,
      durationMonths: 12,
      purpose: "",
    },
  });

  const amount = watch("amount");
  const duration = watch("durationMonths");

  const monthlyPayment = useMemo(() => {
    if (!duration || duration <= 0 || !amount || amount <= 0) return 0;
    if (amount > RATE_THRESHOLD) return 0; // taux à définir par le directeur
    if (!indicativeRate || indicativeRate <= 0) return 0;
    const total = amount * (1 + indicativeRate * (duration / 12));
    return total / duration;
  }, [amount, duration, indicativeRate]);

  const onSubmit = (data: CreateLoanRequestInput) => {
    setSubmitting(true);
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
      })
      .finally(() => setSubmitting(false));
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

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-900">Durée de remboursement</label>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setValue("durationMonths", d)}
                className={`px-4 py-2 rounded border ${
                  duration === d ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"
                }`}
              >
                {d} mois
              </button>
            ))}
          </div>
          {errors.durationMonths && (
            <p className="text-red-500 mt-1">{errors.durationMonths.message}</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-gray-800 font-medium">
            Simulation mensuelle{" "}
            {amount > RATE_THRESHOLD
              ? "(taux à définir par le directeur)"
              : indicativeRate
                ? `(taux indicatif ${indicativeRate * 100}%)`
                : "(taux indicatif non défini)"}
          </p>
          <p className="text-lg font-semibold text-blue-700 mt-1">
            {amount > RATE_THRESHOLD
              ? "-- €/mois"
              : monthlyPayment > 0
                ? `${monthlyPayment.toFixed(2)} €/mois`
                : "-- €/mois"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {amount > RATE_THRESHOLD
              ? "Pour un montant > 5000€, le taux sera proposé par le directeur."
              : indicativeRate
                ? "Calcul simplifié : montant x (1 + taux * durée/12) / durée."
                : "En attente de taux indicatif défini par le directeur."}
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
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

