"use client";

import TransactionHistoryTable from "@/components/bankAccount/TransactionHistoryTable";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";

function TransactionsPage() {
    const { transactions, loading, error } = useTransactionHistory();
    const BANK_NAME = "Avenir Bank";
    const DEBIT_TYPES = ["PAYMENT", "WITHDRAWAL", "TRANSFER", "FEE"];

    const downloadPdf = () => {
        if (!transactions.length) return;

        const ownerName =
            transactions[0]?.debitUserName ??
            transactions[0]?.creditUserName ??
            "Titulaire du compte";

        const rows = transactions
            .map(
                (t) => `
                    <tr>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${new Date(
                            t.createdAt,
                        ).toLocaleString()}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.transactionType}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:${
                            DEBIT_TYPES.includes(t.transactionType) ? "#b91c1c" : "#047857"
                        };font-weight:700;">
                            ${DEBIT_TYPES.includes(t.transactionType) ? "-" : "+"}${t.amount.toFixed(2)} €
                        </td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.debitAccount}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.creditAccount}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.debitUserName ?? ""}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.creditUserName ?? ""}</td>
                        <td style="padding:10px;border:1px solid #e5e7eb;font-size:12px;color:#111827;">${t.transactionReference}</td>
                    </tr>
                `,
            )
            .join("");

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>Relevé des transactions</title>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; margin: 32px; color: #111827; background: #f9fafb; }
                    h1 { font-size: 22px; margin-bottom: 6px; }
                    p { margin-top: 0; color: #6b7280; }
                    table { border-collapse: collapse; width: 100%; margin-top: 16px; background: #fff; border-radius: 12px; overflow: hidden; }
                    th { background:#f3f4f6; border:1px solid #e5e7eb; padding:10px; font-size:12px; text-align:left; }
                    .header-card { background: linear-gradient(135deg, #2563eb, #0ea5e9); color: #fff; padding: 20px; border-radius: 14px; box-shadow: 0 10px 30px rgba(37,99,235,0.25); }
                    .meta { display:flex; gap:20px; margin-top:12px; flex-wrap:wrap; color:#e0f2fe; font-size:13px; }
                    .badge { display:inline-flex; align-items:center; gap:6px; background: rgba(255,255,255,0.15); padding:8px 12px; border-radius:10px; }
                </style>
            </head>
            <body>
                <div class="header-card">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;">
                        <div>
                            <div style="font-size:13px; opacity:0.85;">${BANK_NAME}</div>
                            <h1 style="margin:4px 0 0 0;">Relevé des transactions</h1>
                            <p style="color:#dbeafe;margin:6px 0 0 0;">Généré le ${new Date().toLocaleString()}</p>
                        </div>
                        <div class="badge">
                            <span style="font-weight:600;">Titulaire :</span>
                            <span>${ownerName}</span>
                        </div>
                    </div>
                    <div class="meta">
                        <span class="badge">Période : toutes opérations</span>
                        <span class="badge">Nombre d’opérations : ${transactions.length}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Montant</th>
                            <th>Compte débit</th>
                            <th>Compte crédit</th>
                            <th>Émetteur</th>
                            <th>Destinataire</th>
                            <th>Référence</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
            </html>
        `;

        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
        setTimeout(() => win.close(), 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-10 space-y-8">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">Mes opérations</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">Historique des transactions</h1>
                        <p className="text-gray-600">
                            Retrouve l’ensemble de tes virements, paiements et remboursements en un coup d’œil.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={downloadPdf}
                        disabled={!transactions.length}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        Télécharger mon relevé (PDF)
                    </button>
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 backdrop-blur p-8 text-center text-gray-500 shadow-sm">
                    Chargement de l'historique…
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
                    {error}
                </div>
            )}

            {!loading && !error && <TransactionHistoryTable transactions={transactions} />}
        </div>
    );
}

export default withClientProtection("/login")(TransactionsPage);

