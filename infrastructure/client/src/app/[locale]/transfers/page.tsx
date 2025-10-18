"use client";

import TransferForm from "@/components/bankAccount/TransferForm";
import { useUserAccounts } from "@/lib/hooks/useUserAccounts";

export default function TransfersPage() {
    const { accounts, loading, error, reload } = useUserAccounts();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Effectuer un virement</h1>
                <p className="text-gray-500">
                    Choisis ton compte émetteur puis indique l'IBAN destinataire et le montant à transférer.
                </p>
            </div>

            {loading && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    Chargement des comptes…
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && accounts.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    Aucun compte disponible pour effectuer un virement.
                </div>
            )}

            {!loading && !error && accounts.length > 0 && (
                <TransferForm accounts={accounts} onSuccess={reload} />
            )}
        </div>
    );
}


