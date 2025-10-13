"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { useUserAccounts } from "@/lib/hooks/useUserAccounts";
import { MainAccountCard } from "@/components/bankAccount/MainAccountCard";
import { AccountList } from "@/components/bankAccount/AccountList";

export default function Dashboard() {
    const router  = useRouter();
    const {isAuthenticated} = useContext(AuthContext);
    const {accounts, loading, error} = useUserAccounts();

    useEffect(() => {
        if(!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);


    if(!isAuthenticated) {
        return null;
    }

    const mainAccount = accounts.find((a) => a.accountType === "CHECKING");
    const subAccounts = accounts.filter((a) => a.parentAccountId === mainAccount?.accountNumber);

return (
    <div className="p-6 max-w-7xl mx-auto">
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
          {mainAccount ? (
            <MainAccountCard account={mainAccount} />
          ) : (
            <p className="text-gray-600 text-center mt-6">
              Aucun compte principal trouvé.
            </p>
          )}

          {subAccounts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Autres comptes</h2>
              <AccountList accounts={subAccounts} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
