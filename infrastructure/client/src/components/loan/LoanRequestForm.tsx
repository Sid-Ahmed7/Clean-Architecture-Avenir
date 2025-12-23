"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createLoanRequest, getIndicativeRate } from "@/lib/api/loan";
import { CreateLoanRequestInput, createLoanRequestSchema } from "@/lib/validation/loan/createLoanRequestSchema";
import { getAllAdvisors } from "@/lib/api/auth";
import { AdvisorOption } from "@/types/loan";
import { LoanRequestFields } from "./LoanRequestFields";

const DURATIONS = [6, 12, 18];
const RATE_THRESHOLD = 5000;

export function LoanRequestForm() {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([]);
  const [loadingAdvisors, setLoadingAdvisors] = useState(true);
  const [advisorError, setAdvisorError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [indicativeRate, setIndicativeRate] = useState<number | null>(null);

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
  }, [setValue]);

  const amount = watch("amount");
  const duration = watch("durationMonths");

  const monthlyPayment = useMemo(() => {
    if (!duration || duration <= 0 || !amount || amount <= 0) return 0;
    if (amount > RATE_THRESHOLD) return 0;
    if (!indicativeRate || indicativeRate <= 0) return 0;
    const total = amount * (1 + indicativeRate * (duration / 12));
    return total / duration;
  }, [amount, duration, indicativeRate]);

  const onSubmit = (data: CreateLoanRequestInput) => {
    setSubmitting(true);
    setMessage("");
    setMessageType("");
    createLoanRequest(data)
      .then((res) => {
        if (res.status === 201) {
          setMessage("Demande envoyée au conseiller.");
          setMessageType("success");
          reset();
          return;
        }
        setMessage("Échec de la demande");
        setMessageType("error");
      })
      .catch((error) => {
        console.error("Loan request error:", error);
        const msg =
          error.response?.data?.error ||
          "Erreur lors de la demande. Veuillez réessayer ou contacter votre conseiller.";
        setMessage(msg);
        setMessageType("error");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Client</p>
              <h2 className="text-3xl font-bold text-slate-900">Demande de crédit</h2>
              <p className="text-sm text-slate-600">
                Renseignez les informations essentielles. Votre conseiller recevra automatiquement la demande.
              </p>
            </div>

            {message && (
              <div
                className={`rounded-xl p-4 text-sm ${
                  messageType === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <LoanRequestFields
                advisors={advisors}
                loadingAdvisors={loadingAdvisors}
                advisorError={advisorError}
                register={register}
                errors={errors}
                duration={duration}
                onSelectDuration={(value) => setValue("durationMonths", value)}
                amount={amount}
                indicativeRate={indicativeRate}
                monthlyPayment={monthlyPayment}
                submitting={submitting}
                durations={DURATIONS}
                rateThreshold={RATE_THRESHOLD}
              />

              <p className="text-xs text-slate-500 text-center">
                Une fois envoyée, la demande sera visible par votre conseiller.
              </p>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
            <p className="text-xs uppercase text-slate-500 mb-1">Conseil</p>
            <p className="text-sm text-slate-700">
              Préparez un motif clair et un montant cohérent avec votre besoin. Si le montant dépasse 5000€, le taux sera
              proposé par le directeur après validation.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl text-white p-5 shadow-sm space-y-2">
            <p className="text-xs uppercase text-white/80">Taux indicatif</p>
            <p className="text-2xl font-semibold">
              {indicativeRate ? `${(indicativeRate * 100).toFixed(2)}%` : "En attente"}
            </p>
            <p className="text-sm text-white/80">
              Appliqué automatiquement aux demandes ≤ 5000€. Au-delà, un taux personnalisé sera proposé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanRequestForm;

