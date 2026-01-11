"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Wallet, Search, TrendingUp, Trash2 } from "lucide-react";
import { Account } from "@/types/account";
import { useTranslations } from "next-intl";

export default function AccountsOverviewPage() {
    const t = useTranslations("manager.accounts");
    const { user } = useContext(AuthContext);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        const filtered = accounts.filter(account =>
            account.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.accountNumber.toString().includes(searchTerm)
        );
        setFilteredAccounts(filtered);
    }, [searchTerm, accounts]);

    const fetchAccounts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/director/accounts`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(t("accountLoad"));
            }

            const data = await response.json();
            setAccounts(data);
            setFilteredAccounts(data);
        } catch (error) {
            console.error(t("accountLoad"), error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountNumber: number, accountType: string, userId: string, balance: number) => {
        if (accountType === 'CHECKING') {
            const userCheckingAccounts = accounts.filter(
                acc => acc.userId === userId && acc.accountType === 'CHECKING'
            );

            if (userCheckingAccounts.length === 1) {
                if (balance > 0) {
                    alert(t("deleteConfirm.lastCheckingWithBalance"));
                    return;
                }
            }
        }


        const confirmMessage = balance > 0
            ? t("deleteConfirm.withBalance", { amount: formatCurrency(balance) })
            : t("deleteConfirm.withoutBalance");

        if (!confirm(confirmMessage)) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountNumber}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || t("errors.deleteError"));
                return;
            }

            fetchAccounts(); 
        } catch (error) {
            alert(t("errors.deleteFailed"));
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "danger" | "neutral"> = {
            ACTIVE: "success",
            PENDING: "warning",
            SUSPENDED: "danger",
            CLOSED: "neutral",
        };

        return <Badge variant={variants[status] || "neutral"}>{status}</Badge>;
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
                <p className="text-gray-700">{t("loading")}</p>
            </div>
        );
    }

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
                </div>
                <p className="text-gray-700 ml-14">{t("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">{t("stats.totalAccounts")}</p>
                    <p className="text-3xl font-bold text-gray-900">{accounts.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-gray-600">{t("stats.totalBalance")}</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">{t("stats.activeAccounts")}</p>
                    <p className="text-3xl font-bold text-gray-900">{accounts.filter(a => a.isActive).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder={t("search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.number")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.iban")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.owner")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.type")}</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">{t("table.balance")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.status")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.createdAt")}</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-8 text-gray-500">
                                        {t("table.noAccounts")}
                                    </td>
                                </tr>
                            ) : (
                                filteredAccounts.map((account) => (
                                    <tr key={account.accountNumber} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{account.accountNumber}</td>
                                        <td className="p-4 font-mono text-sm text-gray-700">{account.iban}</td>
                                        <td className="p-4 text-gray-900">{account.userName}</td>
                                        <td className="p-4">
                                            <Badge variant="info">{account.accountType}</Badge>
                                        </td>
                                        <td className="p-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(account.balance)}
                                        </td>
                                        <td className="p-4">{getStatusBadge(account.accountStatus)}</td>
                                        <td className="p-4 text-gray-700">
                                            {new Date(account.createdAt).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteAccount(account.accountNumber, account.accountType, account.userId, account.balance)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t("actions.delete")}
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
