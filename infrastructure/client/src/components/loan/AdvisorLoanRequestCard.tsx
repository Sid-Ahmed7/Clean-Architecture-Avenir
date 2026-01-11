import { LoanDecision, LoanRequest } from "@/types/loan";
import { useTranslations } from "next-intl";

interface AdvisorLoanRequestCardProps  {
  request: LoanRequest;
  submittingId: string | null;
  onDecision: (id: string, decision: LoanDecision) => void;
  onViewProfile: (clientId: string) => void;
};
export function AdvisorLoanRequestCard({
  request,
  submittingId,
  onDecision,
  onViewProfile,
}: AdvisorLoanRequestCardProps) {
  const t = useTranslations("components.loan.advisorCard");
  const isPending = request.status === "PENDING";
  const statusStyle =
    {
      PENDING: "bg-amber-50 text-amber-800 border border-amber-200",
      APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      REJECTED: "bg-rose-50 text-rose-700 border border-rose-200",
    }[request.status] || "bg-blue-50 text-blue-700 border border-blue-100";
  const monthly = request.monthlyPayment ? `${request.monthlyPayment.toLocaleString("fr-FR")} € / ${t("month")}` : "—";
  const duration = request.durationMonths ? `${request.durationMonths} ${t("months")}` : "—";
  const rate = request.proposedRate ? `${request.proposedRate}%` : "—";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("client")}</p>
          <p className="text-lg font-semibold text-slate-900">{request.clientName ?? request.clientId}</p>
          <p className="text-xs text-slate-500">
            {t("createdOn", { date: new Date(request.createdAt).toLocaleDateString("fr-FR") })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>{t(`status.${request.status}`)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs uppercase text-slate-500">{t("amount")}</p>
          <p className="font-semibold text-slate-900">{request.amount.toLocaleString("fr-FR")} €</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs uppercase text-slate-500">{t("duration")}</p>
          <p className="font-semibold text-slate-900">{duration}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs uppercase text-slate-500">{t("proposedRate")}</p>
          <p className="font-semibold text-slate-900">{rate}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs uppercase text-slate-500">{t("monthlyPayment")}</p>
          <p className="font-semibold text-slate-900">{monthly}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
        <p className="text-xs uppercase text-slate-500 mb-1">{t("purpose")}</p>
        <p className="font-medium text-slate-900 leading-relaxed">{request.purpose}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          disabled={!isPending || submittingId === request.id}
          onClick={() => onDecision(request.id, "APPROVE")}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {t("approve")}
        </button>
        <button
          disabled={!isPending || submittingId === request.id}
          onClick={() => onDecision(request.id, "REJECT")}
          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          {t("reject")}
        </button>
        <button
          onClick={() => onViewProfile(request.clientId)}
          className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full hover:bg-slate-800 transition"
        >
          {t("viewProfile")}
        </button>
      </div>
    </div>
  );
}

export default AdvisorLoanRequestCard;

