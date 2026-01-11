"use client";

import TransactionHistoryTable from "@/components/bankAccount/TransactionHistoryTable";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useUserProfile } from "@/hooks/useUserProfile";
import { renderToStaticMarkup } from "react-dom/server";
import { useTranslations } from "next-intl";

const StatementDocument = ({ownerName,ownerAddress,ownerEmail,transactions,bankName,debitTypes,generatedAt}: {
    ownerName: string;
    ownerAddress?: string;
    ownerEmail?: string;
    bankName: string;
    debitTypes: string[];
    generatedAt: string;
    transactions: ReturnType<typeof useTransactionHistory>["transactions"];
}) => (
    <html>
        <head>
            <meta charSet="utf-8" />
            <title>Relevé des transactions</title>
            <style>
                {`
                body { font-family: 'Inter', Arial, sans-serif; margin: 32px; color: #0f172a; background: #f8fafc; }
                h1 { font-size: 22px; margin-bottom: 6px; }
                p { margin-top: 0; color: #475569; }
                table { border-collapse: collapse; width: 100%; margin-top: 16px; background: #fff; border-radius: 12px; overflow: hidden; }
                th { background:#e2e8f0; border:1px solid #e2e8f0; padding:10px; font-size:12px; text-align:left; color:#0f172a; }
                td { padding:10px; border:1px solid #e2e8f0; font-size:12px; color:#0f172a; }
                tr:nth-child(every) {}
                tbody tr:nth-child(odd) { background:#f8fafc; }
                tbody tr:hover { background:#eef2ff; }
                .header-card { background: linear-gradient(135deg, #0f172a, #1d4ed8); color: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 10px 30px rgba(15,23,42,0.25); }
                .meta { display:flex; gap:16px; margin-top:12px; flex-wrap:wrap; color:#e2e8f0; font-size:13px; }
                .badge { display:inline-flex; align-items:center; gap:6px; background: rgba(255,255,255,0.12); padding:8px 12px; border-radius:10px; }
                .section { margin-top: 24px; }
                .section-title { font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; color: #475569; margin-bottom: 6px; }
                .footer { margin-top: 24px; font-size: 12px; color: #475569; }
                `}
            </style>
        </head>
        <body>
            <div className="header-card" style={{ background: "linear-gradient(135deg, #0f172a, #1d4ed8)", color: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 10px 30px rgba(15,23,42,0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: 13, opacity: 0.85 }}>{bankName}</div>
                        <h1 style={{ margin: "4px 0 0 0" }}>Relevé des transactions</h1>
                        <p style={{ color: "#cbd5f5", margin: "6px 0 0 0" }}>Généré le {generatedAt}</p>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 240, alignSelf: "flex-start" }}>
                        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", opacity: 0.75, marginBottom: 4 }}>Titulaire</div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{ownerName}</div>
                        {ownerAddress && <div style={{ fontSize: 12, opacity: 0.9 }}>{ownerAddress}</div>}
                        {ownerEmail && <div style={{ fontSize: 12, opacity: 0.85 }}>{ownerEmail}</div>}
                    </div>
                </div>
                <div className="meta" style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap", color: "#e0f2fe", fontSize: 13 }}>
                    <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: 10 }}>Période : toutes opérations</span>
                    <span className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: 10 }}>
                        Nombre d’opérations : {transactions.length}
                    </span>
                </div>
            </div>

            <div className="section">
                <div className="section-title">Synthèse</div>
                <table style={{ width: "100%", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "25%", fontWeight: 600 }}>Titulaire</td>
                            <td>{ownerName}</td>
                        </tr>
                        {ownerAddress && (
                            <tr>
                                <td style={{ fontWeight: 600 }}>Adresse</td>
                                <td>{ownerAddress}</td>
                            </tr>
                        )}
                        {ownerEmail && (
                            <tr>
                                <td style={{ fontWeight: 600 }}>Email</td>
                                <td>{ownerEmail}</td>
                            </tr>
                        )}
                        <tr>
                            <td style={{ fontWeight: 600 }}>Période</td>
                            <td>Toutes opérations disponibles</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Généré le</td>
                            <td>{generatedAt}</td>
                        </tr>
                    </tbody>
                </table>
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
                <tbody>
                    {transactions.map((t) => {
                        const isDebit = debitTypes.includes(t.transactionType);
                        return (
                            <tr key={t.transactionReference ?? t.createdAt}>
                                <td>{new Date(t.createdAt).toLocaleString()}</td>
                                <td>{t.transactionType}</td>
                                <td style={{ color: isDebit ? "#b91c1c" : "#047857", fontWeight: 700 }}>
                                    {isDebit ? "-" : "+"}
                                    {t.amount.toFixed(2)} €
                                </td>
                                <td>{t.debitAccount}</td>
                                <td>{t.creditAccount}</td>
                                <td>{t.debitUserName ?? ""}</td>
                                <td>{t.creditUserName ?? ""}</td>
                                <td>{t.transactionReference}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="footer">
                Document généré automatiquement. Pour toute question, merci de contacter votre conseiller. Les montants négatifs correspondent aux débits, les montants positifs aux crédits.
            </div>
        </body>
    </html>
);

function TransactionsPage() {
    const { transactions, loading, error } = useTransactionHistory();
    const { user: profile } = useUserProfile();
    const t = useTranslations("pages.transactions");
    const BANK_NAME = "Avenir Bank";
    const DEBIT_TYPES = ["PAYMENT", "WITHDRAWAL", "TRANSFER", "FEE"];

    const loadHtml2Pdf = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.html2pdf) {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load html2pdf library"));
            document.head.appendChild(script);
        });
    };

    const downloadPdf = async () => {
        if (!transactions.length) return;

        try {
            const generatedAt = new Date().toLocaleString();
            const ownerName =
                [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
                profile?.name ||
                transactions[0]?.debitUserName ||
                transactions[0]?.creditUserName ||
                "Titulaire du compte";

            await loadHtml2Pdf();
            if (!window.html2pdf) {
                throw new Error("PDF generator unavailable");
            }

            const html = "<!DOCTYPE html>" +
                renderToStaticMarkup(
                    <StatementDocument
                        ownerName={ownerName}
                        ownerAddress={profile?.address}
                        ownerEmail={profile?.email}
                        transactions={transactions}
                        bankName={BANK_NAME}
                        debitTypes={DEBIT_TYPES}
                        generatedAt={generatedAt}
                    />,
                );

            const container = document.createElement("div");
            container.innerHTML = html;

            await window.html2pdf()
                .set({
                    margin: 10,
                    filename: `releve-transactions-${new Date().toISOString().split('T')[0]}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                })
                .from(container)
                .save();
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert(t("error.pdfGeneration"));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-10 space-y-8">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">{t("subtitle")}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
                        <p className="text-gray-600">
                            {t("description")}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={downloadPdf}
                        disabled={!transactions.length}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {t("downloadButton")}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 backdrop-blur p-8 text-center text-gray-500 shadow-sm">
                    {t("loading")}
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

