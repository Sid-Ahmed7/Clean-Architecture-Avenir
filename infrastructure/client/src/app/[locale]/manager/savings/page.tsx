"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { PiggyBank, Search, TrendingUp, DollarSign, Trash2 } from "lucide-react";

interface SavingsAccount {
    accountNumber: number;
    balance: number;
    interestRate: number;
    productId: string;
    isActive: boolean;
    totalInterestEarned: number;
    userId: string;
    userName: string;
    lastBalanceUpdate: Date;
    lastInterestApplied?: Date;
}

export default function SavingsAccountsOverviewPage() {
    const { user } = useContext(AuthContext);
    const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<SavingsAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSavingsAccounts();
    }, []);

    useEffect(() => {
        const filtered = savingsAccounts.filter(account =>
            account.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.accountNumber.toString().includes(searchTerm)
        );
        setFilteredAccounts(filtered);
    }, [searchTerm, savingsAccounts]);

    const fetchSavingsAccounts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/director/savings-accounts`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch savings accounts");
            }

            const data = await response.json();
            setSavingsAccounts(data);
            setFilteredAccounts(data);
        } catch (error) {
            console.error("Failed to load savings accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSavingsAccount = async (accountNumber: number, balance: number) => {
        // Message de confirmation avec info sur le transfert
        const confirmMessage = balance > 0
            ? `Êtes-vous sûr de vouloir supprimer ce compte épargne ?\n\nLe solde de ${formatCurrency(balance)} sera automatiquement transféré vers un compte courant de l'utilisateur.`
            : "Êtes-vous sûr de vouloir supprimer ce compte épargne ?";

        if (!confirm(confirmMessage)) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/savings-accounts/${accountNumber}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || "Erreur lors de la suppression");
                return;
            }

            console.log("Compte épargne supprimé avec succès");
            fetchSavingsAccounts(); // Rafraîchir la liste
        } catch (error) {
            console.error("Failed to delete savings account:", error);
            alert("Erreur lors de la suppression du compte épargne");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-700">Chargement...</p>
            </div>
        );
    }

    const totalBalance = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalInterestEarned = savingsAccounts.reduce((sum, account) => sum + account.totalInterestEarned, 0);
    const averageInterestRate = savingsAccounts.length > 0
        ? savingsAccounts.reduce((sum, account) => sum + account.interestRate, 0) / savingsAccounts.length
        : 0;

    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                        <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble des Comptes Épargne</h1>
                </div>
                <p className="text-gray-700 ml-14">Consultez tous les comptes épargne, taux d'intérêt et gains</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">Total Comptes</p>
                    <p className="text-3xl font-bold text-gray-900">{savingsAccounts.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-gray-600">Solde Total</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm text-gray-600">Intérêts Totaux</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalInterestEarned)}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">Taux Moyen</p>
                    <p className="text-3xl font-bold text-green-600">{averageInterestRate.toFixed(2)}%</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Rechercher par nom ou numéro de compte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Savings Accounts Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">Numéro</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">Propriétaire</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">Solde</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">Taux d'intérêt</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">Intérêts Totaux</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">Statut</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">Dernière MAJ</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-8 text-gray-500">
                                        Aucun compte épargne trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredAccounts.map((account) => (
                                    <tr key={account.accountNumber} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{account.accountNumber}</td>
                                        <td className="p-4 text-gray-900">{account.userName}</td>
                                        <td className="p-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(account.balance)}
                                        </td>
                                        <td className="p-4 text-right text-green-600 font-semibold">
                                            {account.interestRate.toFixed(2)}%
                                        </td>
                                        <td className="p-4 text-right text-emerald-600">
                                            {formatCurrency(account.totalInterestEarned)}
                                        </td>
                                        <td className="p-4">
                                            {account.isActive ? (
                                                <Badge variant="success">Actif</Badge>
                                            ) : (
                                                <Badge variant="neutral">Inactif</Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {new Date(account.lastBalanceUpdate).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteSavingsAccount(account.accountNumber, account.balance)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
