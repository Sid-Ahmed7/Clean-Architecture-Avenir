import Button from "@/components/ui/Button";
import { LoanRequestFieldsProps } from "@/types/loan";

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
        {errors.amount && (
          <p className="text-red-500 mt-1">Veuillez saisir un montant valide et supérieur à 0.</p>
        )}
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
          placeholder="Exemple : Achat d'un véhicule, rénovation de la maison, etc."
        />
        {errors.purpose && (
          <p className="text-red-500 mt-1">Veuillez préciser le motif de votre demande.</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-900">Durée de remboursement</label>
        <div className="flex gap-2 flex-wrap">
          {durations.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelectDuration(d)}
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
          {amount > rateThreshold
            ? "(taux à définir par le directeur)"
            : indicativeRate
              ? `(taux indicatif ${indicativeRate * 100}%)`
              : "(taux indicatif non défini)"}
        </p>
        <p className="text-lg font-semibold text-blue-700 mt-1">
          {amount > rateThreshold
            ? "-- €/mois"
            : monthlyPayment > 0
              ? `${monthlyPayment.toFixed(2)} €/mois`
              : "-- €/mois"}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {amount > rateThreshold
            ? "Pour un montant > 5000€, le taux sera proposé par le directeur."
            : indicativeRate
              ? "En attente de taux indicatif défini par le directeur."
              : ""}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        Envoyer la demande
      </Button>
    </>
  );
}


