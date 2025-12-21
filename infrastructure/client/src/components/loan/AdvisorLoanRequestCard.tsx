import { AdvisorLoanRequestCardProps } from "@/types/loan";

export function AdvisorLoanRequestCard({
  request,
  submittingId,
  onDecision,
  onViewProfile,
}: AdvisorLoanRequestCardProps) {
  const isPending = request.status === "PENDING";

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">Client</p>
          <p className="text-sm font-semibold text-gray-900">{request.clientName ?? request.clientId}</p>
          <p className="text-xs text-gray-500">
            Créée le {new Date(request.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-3 rounded-md bg-gray-50">
          <p className="text-xs uppercase text-gray-500">Montant</p>
          <p className="font-semibold text-gray-900">{request.amount.toLocaleString("fr-FR")} €</p>
        </div>
        <div className="p-3 rounded-md bg-gray-50">
          <p className="text-xs uppercase text-gray-500">Taux proposé</p>
          <p className="font-semibold text-gray-900">{request.proposedRate ? `${request.proposedRate}%` : "—"}</p>
        </div>
        <div className="p-3 rounded-md bg-gray-50 col-span-2">
          <p className="text-xs uppercase text-gray-500">Motif</p>
          <p className="font-medium text-gray-900">{request.purpose}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          disabled={!isPending || submittingId === request.id}
          onClick={() => onDecision(request.id, "APPROVE")}
          className="px-3 py-2 rounded bg-green-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Accepter
        </button>
        <button
          disabled={!isPending || submittingId === request.id}
          onClick={() => onDecision(request.id, "REJECT")}
          className="px-3 py-2 rounded bg-red-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refuser
        </button>
        <button
          onClick={() => onViewProfile(request.clientId)}
          className="px-3 py-2 rounded bg-gray-200 text-gray-800 text-sm w-full"
        >
          Voir profil
        </button>
      </div>
    </div>
  );
}

export default AdvisorLoanRequestCard;

