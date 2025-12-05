"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";
import SummaryCard from "@/components/bankAccount/SummaryAccountsCard";
import { useLocale } from "next-intl";
import { Plus, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ChartAccountManage from "@/components/ui/ChartAccountManage";
import { RoleBasedAccess, ClientOnly, BankAdvisorOnly, BankManagerOnly, AdminOnly } from "@/components/auth/RoleBasedAccess";
import { RoleEnum } from "@/types/RoleEnum";

export default function Dashboard() {
    const {accounts, loading, error} = useUserAccounts();

    const mainAccount = accounts.find((a) => a.accountType === "CHECKING");
    const subAccounts = accounts.filter((a) => a.parentAccountId === mainAccount?.accountNumber);

return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
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

    {/* Common content for all roles */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SummaryCard accounts={accounts} />
      <ChartAccountManage accounts={accounts} />
    </div>

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
      <section className="mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Administration</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-700">Gérez les conseillers bancaires et les paramètres de l'agence.</p>
          <div className="flex gap-4 mt-4">
            <Link href="/create-advisor">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Créer un conseiller
              </button>
            </Link>
            <Link href="/agency-settings">
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Paramètres de l'agence
              </button>
            </Link>
          </div>
        </div>
      </section>
    </BankManagerOnly>

    {/* Admin specific content */}
    <AdminOnly>
      <section className="mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Administration Système</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-700">Gérez les gestionnaires bancaires et les paramètres système.</p>
          <div className="flex gap-4 mt-4">
            <Link href="/create-manager">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Créer un gestionnaire
              </button>
            </Link>
            <Link href="/system-settings">
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Paramètres système
              </button>
            </Link>
          </div>
        </div>
      </section>
    </AdminOnly>
  </>
)}
    </div>
  );
}
