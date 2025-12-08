"use client";

import { useUserAccounts } from "@/hooks/useUserAccounts";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";
import SummaryCard from "@/components/bankAccount/SummaryAccountsCard";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ChartAccountManage from "@/components/ui/ChartAccountManage";

export default function ClientDashboard() {
    const { accounts, loading, error } = useUserAccounts();

    const mainAccount = accounts.find((a) => a.accountType === "CHECKING");
    const subAccounts = accounts.filter((a) => a.parentAccountId === mainAccount?.accountNumber);

    return (
        <div className="min-h-screen bg-white p-6 max-w-7xl mx-auto space-y-8">
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
                </>
            )}
        </div>
    );
}
