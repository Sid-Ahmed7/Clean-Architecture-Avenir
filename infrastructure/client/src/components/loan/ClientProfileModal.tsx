import { LoanRepaymentSchedule, LoanRequest, ClientDetails } from "@/types/loan";
import { useTranslations } from "next-intl";

interface ClientProfileModalProps  {
  clientId: string;
  details: ClientDetails;
  history: LoanRequest[];
  repayments: LoanRepaymentSchedule[];
  onClose: () => void;
};
export function ClientProfileModal({clientId,details,history,repayments,onClose,}: ClientProfileModalProps) {
  const t = useTranslations("components.loan.clientModal");
  const getRepayment = (loanId: string) => repayments.find((r) => r.loanRequestId === loanId);

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs uppercase text-gray-400">{t("title")}</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {`${details.user?.firstName ?? ""} ${details.user?.lastName ?? ""}`.trim() ||
                details.user?.email ||
                clientId}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg" aria-label={t("close")}>
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs uppercase text-gray-500 mb-1">{t("identity")}</p>
            <p className="text-sm text-gray-800">
              <span className="font-medium">{t("email")} :</span> {details.user?.email ?? "—"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs uppercase text-gray-500 mb-2">{t("accounts")}</p>
            <div className="space-y-2">
              {(details.accounts ?? []).map((acc) => (
                <div
                  key={acc.accountNumber}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 bg-white"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {acc.accountType} — {acc.accountNumber}
                    </p>
                    <p className="text-xs text-gray-600">{t("iban")} : {acc.iban ?? "N/A"}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {acc.currentBalance} {acc.currency}
                  </div>
                </div>
              ))}
              {(details.accounts ?? []).length === 0 && (
                <p className="text-sm text-gray-600">{t("noAccountsFound")}</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs uppercase text-gray-500 mb-2">{t("loanHistory")}</p>
            <div className="space-y-2">
              {history.map((loan) => {
                const repayment = getRepayment(loan.id);
                const remainingTerms = repayment
                  ? Math.max((repayment.durationMonths ?? 0) - (repayment.paymentsMade ?? 0), 0)
                  : null;
                return (
                  <div key={loan.id} className="rounded-lg border border-gray-200 px-3 py-2 bg-white">
                    <div className="flex justify-between text-sm text-gray-900">
                      <span>{loan.amount?.toLocaleString("fr-FR")} €</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {t(`status.${loan.status}`)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{loan.purpose}</div>
                    <div className="text-[11px] text-gray-500">
                      {t("createdOn", { date: loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("fr-FR") : "—" })}
                    </div>
                    {repayment && (
                      <div className="mt-2 text-[11px] text-gray-700 space-y-1">
                        <div>{t("monthlyPayment")} : {repayment.monthlyAmount?.toFixed(2)} €</div>
                        <div>
                          {t("remainingPrincipal")} : {repayment.remainingPrincipal?.toFixed(2)} €
                          {remainingTerms !== null
                            ? ` (${remainingTerms} ${t("remainingInstallments", { count: remainingTerms })})`
                            : ""}
                        </div>
                        <div>
                          {t("nextDueDate")} :{" "}
                          {repayment.nextDueDate ? new Date(repayment.nextDueDate).toLocaleDateString("fr-FR") : "—"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {history.length === 0 && <p className="text-sm text-gray-600">{t("noLoansFound")}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileModal;

