"use client";

import TransferForm from "@/components/bankAccount/TransferForm";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { useUserAccounts } from "@/hooks/useUserAccounts";

function TransfersPage() {
    const { accounts, loading, error } = useUserAccounts();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Chargement de tes comptes…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow p-6 text-center space-y-3">
                    <p className="text-gray-900 font-semibold">Aucun compte disponible</p>
                    <p className="text-gray-500 text-sm">Crée un compte pour effectuer un virement.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <TransferForm accounts={accounts} />
        </div>
    );
}

export default withClientProtection("/login")(TransfersPage);
