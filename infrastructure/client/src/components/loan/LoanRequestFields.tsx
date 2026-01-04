import { LoanRequestFieldsProps } from "@/types/loan";
import Button from "@/components/ui/Button";

export function LoanRequestFields({
  advisors,
  loadingAdvisors,
  advisorError,
  register,
  errors,
  duration,
  onSelectDuration,
  amount,
  indicativeRate,
  monthlyPayment,
  submitting,
  durations,
  rateThreshold,
}: LoanRequestFieldsProps) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800" htmlFor="advisorId">
          Choisir un conseiller
        </label>
        {loadingAdvisors ? (
          <p className="text-sm text-slate-600">Chargement des conseillers...</p>
        ) : advisorError ? (
          <p className="text-sm text-rose-600">{advisorError}</p>
        ) : (
          <select
            id="advisorId"
            {...register("advisorId")}
            className="w-full px-3 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {advisors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName}
              </option>
            ))}
          </select>
        )}
        {errors.advisorId && <p className="text-rose-600 text-sm">{errors.advisorId.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800" htmlFor="amount">
          Montant demandé
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="w-full px-3 py-3 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {errors.amount && (
          <p className="text-rose-600 text-sm">Veuillez saisir un montant valide et supérieur à 0.</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800" htmlFor="purpose">
          Motif
        </label>
        <textarea
          id="purpose"
          {...register("purpose")}
          className="w-full px-3 py-3 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
          rows={3}
          placeholder="Exemple : Achat d'un véhicule, rénovation de la maison, etc."
        />
        {errors.purpose && (
          <p className="text-rose-600 text-sm">Veuillez préciser le motif de votre demande.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">Durée de remboursement</label>
        <div className="flex gap-2 flex-wrap">
          {durations.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelectDuration(d)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                duration === d
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {d} mois
            </button>
          ))}
        </div>
        {errors.durationMonths && (
          <p className="text-rose-600 text-sm">{errors.durationMonths.message}</p>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
        <p className="text-sm font-semibold text-slate-800">
          {t("simulationTitle")}{" "}
          {amount > rateThreshold
            ? t("rateByDirector")
            : indicativeRate
              ? t("indicativeRate", { rate: (indicativeRate * 100).toFixed(2) })
              : t("rateNotDefined")}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-1">
          {amount > rateThreshold
            ? t("monthlyNotAvailable")
            : monthlyPayment > 0
              ? t("monthlyAmount", { amount: monthlyPayment.toFixed(2) })
              : t("monthlyNotAvailable")}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          {amount > rateThreshold
            ? t("rateProposalNote")
            : indicativeRate
              ? t("waitingForRate")
              : t("rateWillAppear")}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {t("submitButton")}
      </Button>
    </>
  );
}


