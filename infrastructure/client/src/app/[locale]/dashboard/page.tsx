"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";
import SummaryCard from "@/components/bankAccount/SummaryAccountsCard";
import { Plus, Shield, UserCog, Settings, PiggyBank, Activity, Briefcase } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ChartAccountManage from "@/components/ui/ChartAccountManage";
import { RoleBasedAccess, ClientOnly, BankAdvisorOnly, BankManagerOnly, AdminOnly } from "@/components/auth/RoleBasedAccess";
import { RoleEnum } from "@/types/RoleEnum";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
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
          {/* Welcome message based on role */}
          <div className="mb-6">
            <ClientOnly>
              <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur votre tableau de bord client</h1>
            </ClientOnly>

            <BankAdvisorOnly>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord conseiller bancaire</h1>
            </BankAdvisorOnly>

            <BankManagerOnly>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord gestionnaire</h1>
            </BankManagerOnly>

            <AdminOnly>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            </AdminOnly>
          </div>

          {/* Client-specific summary and charts */}
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryCard accounts={accounts} />
              <ChartAccountManage accounts={accounts} />
            </div>
          </ClientOnly>

          {/* Client-specific content */}
          <ClientOnly>
            {mainAccount ? (
              <MainAccountCard account={mainAccount} />
            ) : (
              <p className="text-gray-600 text-center mt-6">
                Aucun compte principal trouvé.
              </p>
            )}

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Autres comptes</h2>
                <Link href="/add-sub-account">
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
          </ClientOnly>

          {/* Bank Advisor specific content */}
          <BankAdvisorOnly>
            <section className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion des clients</h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-700">Accédez à la liste de vos clients et gérez leurs comptes.</p>
                <Link href="/clients">
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Voir mes clients
                  </button>
                </Link>
              </div>
            </section>
          </BankAdvisorOnly>

          {/* Bank Manager specific content */}
          <BankManagerOnly>
            <section className="space-y-6">
              {/* Manager Header */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestion de l'Agence</h2>
                </div>
                <p className="text-gray-700 ml-14">Administration des conseillers et paramètres de l'agence</p>
              </div>

              {/* Manager Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Advisor Management */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCog className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Gestion des Conseillers</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Créez et gérez les conseillers bancaires de votre agence.
                  </p>
                  <div className="space-y-2">
                    <Link href="/create-advisor">
                      <Button variant="primary" fullWidth icon={UserCog} size="sm">
                        Créer un conseiller
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Agency Settings */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Paramètres de l'Agence</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurez les paramètres de votre agence.
                  </p>
                  <div className="space-y-2">
                    <Link href="/agency-settings">
                      <Button variant="secondary" fullWidth icon={Settings} size="sm">
                        Paramètres agence
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </BankManagerOnly>

          {/* Admin specific content */}
          <AdminOnly>
            <section className="space-y-6">
              {/* Admin Header */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Administration Système</h2>
                </div>
                <p className="text-gray-700 ml-14">Gestion complète du système bancaire</p>
              </div>

              {/* Admin Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Management */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCog className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Gestion des Utilisateurs</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Créez et gérez les gestionnaires bancaires.
                  </p>
                  <div className="space-y-2">
                    <Link href="/create-manager">
                      <Button variant="primary" fullWidth icon={UserCog} size="sm">
                        Créer un gestionnaire
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* System Settings */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Paramètres Système</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurez les paramètres globaux.
                  </p>
                  <div className="space-y-2">
                    <Link href="/system-settings">
                      <Button variant="secondary" fullWidth icon={Settings} size="sm">
                        Paramètres système
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Savings Management */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Comptes Épargne</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Gérez les comptes épargne du système.
                  </p>
                  <div className="space-y-2">
                    <Link href="/manage-savings">
                      <Button variant="success" fullWidth icon={PiggyBank} size="sm">
                        Gestion épargne
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Activity className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Statistiques</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Vue d'ensemble du système.
                  </p>
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400">Bientôt disponible</p>
                  </div>
                </div>
              </div>
            </section>
          </AdminOnly>
        </>
      )}
    </div>
  );
}
