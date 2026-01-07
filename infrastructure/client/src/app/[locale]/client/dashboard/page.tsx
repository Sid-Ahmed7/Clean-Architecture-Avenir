"use client";

import { useUserAccounts } from "@/hooks/useUserAccounts";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useLastTransactions } from "@/hooks/useLastTransactions";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";
import SummaryCard from "@/components/bankAccount/SummaryAccountsCard";
import QuickTransferCard from "@/components/bankAccount/QuickTransferCard";
import { Plus, PiggyBank, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ChartAccountManage from "@/components/ui/ChartAccountManage";
import { useEffect, useState } from "react";
import { getAllSavingsAccounts } from "@/lib/api/savingsAccount";
import { SavingsAccount } from "@/types/savingsAccount";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function ClientDashboard() {
    const t = useTranslations("client.dashboard");
    const locale = useLocale();
    const dateLocale = locale === 'fr' ? fr : enUS;
    const { accounts, loading, error } = useUserAccounts();
    const { transactions, loading: txLoading, error: txError } = useTransactionHistory();
    const { transactions: lastTransactions, loading: lastTxLoading, refetch: refetchLastTransactions } = useLastTransactions(6);
    const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
    const [loadingSavings, setLoadingSavings] = useState(true);

    const mainAccount = accounts.find((a) => a.accountType === "CHECKING");
    const subAccounts = accounts.filter((a) => a.parentAccountId === mainAccount?.accountNumber);

    useEffect(() => {
        const fetchSavings = async () => {
            try {
                const data = await getAllSavingsAccounts();
                setSavingsAccounts(data);
            } catch (err) {
                console.error("Error fetching savings accounts:", err);
            } finally {
                setLoadingSavings(false);
            }
        };
        fetchSavings();
    }, []);

    return (
        <div className="min-h-screen bg-white p-6 space-y-8">
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500 animate-pulse">{t("loading")}</p>
                </div>
            )}

            {!loading && error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{t("welcome")}</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SummaryCard accounts={accounts} />
                        <ChartAccountManage accounts={accounts} />
                    </div>


                    <section className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{t("recentTransactions.title")}</h2>
                                <p className="text-sm text-gray-500">{t("recentTransactions.subtitle")}</p>
                            </div>
                            <Link href="/transactions">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                    {t("recentTransactions.viewAll")}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {txLoading && (
                            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-gray-500">
                                {t("recentTransactions.loading")}
                            </div>
                        )}

                        {!txLoading && txError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
                                {txError}
                            </div>
                        )}

                        {!txLoading && !txError && (
                            <div className="space-y-3">
                                {transactions.slice(0, 5).map((tx) => {
                                    const isDebit = mainAccount && tx.debitAccount === mainAccount.accountNumber;
                                    const amountSign = isDebit ? "-" : "+";
                                    const amountColor = isDebit ? "text-red-600" : "text-green-600";

                                    const counterpartAccountNumber = isDebit ? tx.creditAccount : tx.debitAccount;
                                    const counterpartUserName = isDebit ? tx.creditUserName : tx.debitUserName;
                                    const counterpartAccount = accounts.find((a) => a.accountNumber === counterpartAccountNumber);
                                    const userLabel = counterpartUserName ?? t("recentTransactions.unknownUser");
                                    const accountLabel = counterpartAccount?.customAccountName
                                        ? counterpartAccount.customAccountName
                                        : counterpartUserName
                                            ? `${t("recentTransactions.account")} ${userLabel}`
                                            : counterpartAccountNumber
                                                ? `${t("recentTransactions.account")} ${counterpartAccountNumber}`
                                                : t("recentTransactions.unknownAccount");

                                    return (
                                        <div
                                            key={tx.transactionReference}
                                            className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:border-gray-200"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {accountLabel}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">

                                                    {userLabel}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(tx.createdAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {t("recentTransactions.ref")}: {tx.transactionReference}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-base font-semibold ${amountColor}`}>
                                                    {amountSign}
                                                    {tx.amount.toFixed(2)} €
                                                </p>
                                                <p className="text-xs text-gray-600">{tx.transactionType}</p>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <QuickTransferCard
                        transactions={lastTransactions}
                        accounts={accounts}
                        onTransferSuccess={refetchLastTransactions}
                    />

                    {mainAccount ? (
                        <MainAccountCard account={mainAccount} />
                    ) : (
                        <p className="text-gray-600 text-center mt-6">
                            {t("otherAccounts.noMain")}
                        </p>
                    )}

                    {/* Sub accounts */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{t("otherAccounts.title")}</h2>
                            <Link href="/client/add-sub-account">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    {t("otherAccounts.addAccount")}
                                </button>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <AccountList accounts={subAccounts} />
                        </div>
                    </section>

                    <section className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <PiggyBank className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{t("savings.title")}</h2>
                                    <p className="text-sm text-gray-500">{t("savings.subtitle")}</p>
                                </div>
                            </div>
                            <Link href="/client/savings">
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-md">
                                    {t("savings.viewAll")}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {loadingSavings ? (
                            <div className="flex justify-center items-center h-32">
                                <p className="text-gray-500 animate-pulse">{t("savings.loading")}</p>
                            </div>
                        ) : savingsAccounts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savingsAccounts.map((account) => (
                                    <div
                                        key={account.accountNumber}
                                        className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">{t("savings.account")} #{account.accountNumber}</p>
                                                    <p className="text-sm font-semibold text-gray-900">{account.productId}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {account.isActive ? t("savings.active") : t("savings.inactive")}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{t("savings.availableBalance")}</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {(account.balance ?? 0).toFixed(2)} €
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">{t("savings.interestRate")}</p>
                                                    <p className="text-sm font-semibold text-emerald-600">{account.interestRate}%</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">{t("savings.earnedInterests")}</p>
                                                    <p className="text-sm font-semibold text-emerald-600">
                                                        +{(account.totalInterestEarned ?? 0).toFixed(2)} €
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-50 to-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center">
                                <PiggyBank className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium mb-2">{t("savings.noSavings")}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    {t("savings.startSaving")}
                                </p>
                                <Link href="/client/savings">
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                                        {t("savings.discover")}
                                    </button>
                                </Link>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
