"use client";

import { useUserAccounts } from "@/hooks/useUserAccounts";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";
import SummaryCard from "@/components/bankAccount/SummaryAccountsCard";
import { Plus, PiggyBank, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ChartAccountManage from "@/components/ui/ChartAccountManage";
import { useEffect, useState } from "react";
import { getAllSavingsAccounts } from "@/lib/api/savingsAccount";

export default function ClientDashboard() {
    const { accounts, loading, error } = useUserAccounts();
    const [savingsAccounts, setSavingsAccounts] = useState<any[]>([]);
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
                    <p className="text-gray-500 animate-pulse">Chargement...</p>
                </div>
            )}

            {!loading && error && (
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Welcome message */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur votre tableau de bord client</h1>
                    </div>

                    {/* Summary and charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SummaryCard accounts={accounts} />
                        <ChartAccountManage accounts={accounts} />
                    </div>

                    {/* Main account */}
                    {mainAccount ? (
                        <MainAccountCard account={mainAccount} />
                    ) : (
                        <p className="text-gray-600 text-center mt-6">
                            Aucun compte principal trouvé.
                        </p>
                    )}

                    {/* Sub accounts */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Autres comptes</h2>
                            <Link href="/client/add-sub-account">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    Ajouter un compte
                                </button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AccountList accounts={subAccounts} />
                        </div>
                    </section>

                    {/* Savings Accounts Section */}
                    <section className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <PiggyBank className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Mes Livrets d'Épargne</h2>
                                    <p className="text-sm text-gray-500">Livret A, LDDS et autres produits d'épargne</p>
                                </div>
                            </div>
                            <Link href="/client/savings">
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-md">
                                    Voir tout
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {loadingSavings ? (
                            <div className="flex justify-center items-center h-32">
                                <p className="text-gray-500 animate-pulse">Chargement des livrets...</p>
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
                                                    <p className="text-xs text-gray-500">Compte #{account.accountNumber}</p>
                                                    <p className="text-sm font-semibold text-gray-900">{account.productId}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {account.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Solde disponible</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {(account.balance ?? 0).toFixed(2)} €
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">Taux d'intérêt</p>
                                                    <p className="text-sm font-semibold text-emerald-600">{account.interestRate}%</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Intérêts gagnés</p>
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
                                <p className="text-gray-600 font-medium mb-2">Aucun livret d'épargne</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Commencez à épargner dès aujourd'hui avec nos produits d'épargne
                                </p>
                                <Link href="/client/savings">
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                                        Découvrir nos livrets
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
