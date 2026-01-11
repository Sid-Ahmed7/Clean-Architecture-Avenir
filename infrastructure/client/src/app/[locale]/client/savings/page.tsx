"use client";

import { useState, useEffect } from "react";
import { getAllSavingsProducts, subscribeToSavingsProduct, getMySavingsAccounts } from "@/lib/api/savingsProduct";
import { ArrowLeft, TrendingUp, DollarSign, Percent, CheckCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useFormatter } from "next-intl";

interface SavingsProduct {
    id: string;
    name: string;
    description: string;
    interestRate: number;
    maxDepositAmount: number | null;
    minDepositAmount: number | null;
    isActive: boolean;
}

interface MySavingsAccount {
    accountNumber: number;
    productId: string;
    interestRate: number;
    balance: number;
    totalInterestEarned: number;
    pendingInterest?: number; 
    isActive: boolean;
    lastBalanceUpdate: string;
}

export default function ClientSavingsPage() {
    const router = useRouter();
    const t = useTranslations("client.savingsPage");
    const format = useFormatter();
    const [products, setProducts] = useState<SavingsProduct[]>([]);
    const [myAccounts, setMyAccounts] = useState<MySavingsAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, accountsData] = await Promise.all([
                getAllSavingsProducts(true),
                getMySavingsAccounts()
            ]);
            setProducts(productsData);
            setMyAccounts(Array.isArray(accountsData) ? accountsData : []);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (productId: string) => {
        try {
            setSubscribing(productId);
            setMessage("");
            await subscribeToSavingsProduct(productId);
            setMessage(t("subscriptionSuccess"));
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || t("subscriptionError"));
        } finally {
            setSubscribing(null);
        }
    };

    const handleDeposit = async () => {
        if (!selectedAccount || !amount) return;

        try {
            const { depositToSavingsAccount } = await import("@/lib/api/savingsAccount");
            await depositToSavingsAccount(selectedAccount, Number(amount));
            setMessage(t("depositModal.success", { amount }));
            setShowDepositModal(false);
            setAmount("");
            setSelectedAccount(null);
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || t("depositModal.error"));
        }
    };

    const handleWithdraw = async () => {
        if (!selectedAccount || !amount) return;

        try {
            const { withdrawFromSavingsAccount } = await import("@/lib/api/savingsAccount");
            await withdrawFromSavingsAccount(selectedAccount, Number(amount));
            setMessage(t("withdrawModal.success", { amount }));
            setShowWithdrawModal(false);
            setAmount("");
            setSelectedAccount(null);
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || t("withdrawModal.error"));
        }
    };

    const isSubscribed = (productId: string) => {
        return myAccounts.some(acc => acc.productId === productId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">{t("back")}</span>
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        💰 {t("title")}
                    </h1>
                    <p className="text-gray-600">
                        {t("subtitle")}
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.includes("réussie") || message.includes("success")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message}
                    </div>
                )}

                {myAccounts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("myAccounts")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myAccounts.map((account) => {
                                const pendingInterest = account.pendingInterest ?? (() => {
                                    const secondsSinceLastUpdate = Math.floor(
                                        (new Date().getTime() - new Date(account.lastBalanceUpdate).getTime()) / 1000
                                    );
                                    return (account.balance * account.interestRate * 1000000 * secondsSinceLastUpdate) / (31536000 * 100);
                                })();

                                return (
                                    <div
                                        key={account.accountNumber}
                                        className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="font-bold text-gray-900">
                                                {t("account")} #{account.accountNumber}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t("balance")} :</span>
                                                <span className="font-bold text-gray-900 text-lg">
                                                    {format.number(account.balance ?? 0, { style: "currency", currency: "EUR" })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t("rate")} :</span>
                                                <span className="font-bold text-emerald-600">
                                                    {format.number(account.interestRate)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t("interestEarned")} :</span>
                                                <span className="font-bold text-emerald-600">
                                                    +{format.number(account.totalInterestEarned, { style: "currency", currency: "EUR" })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                <span className="text-gray-600 text-sm">Intérêts en attente :</span>
                                                <span className="font-bold text-amber-700">
                                                    +{format.number(pendingInterest, { style: "currency", currency: "EUR" })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account.accountNumber);
                                                    setShowDepositModal(true);
                                                }}
                                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                                            >
                                                {t("deposit")}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account.accountNumber);
                                                    setShowWithdrawModal(true);
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                            >
                                                {t("withdraw")}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("availableProducts")}
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <p className="text-gray-500">{t("noProducts")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => {
                                const subscribed = isSubscribed(product.id);

                                return (
                                    <div
                                        key={product.id}
                                        className={`bg-white rounded-2xl shadow-xl p-6 border-2 transition-all ${subscribed
                                            ? "border-emerald-300 bg-emerald-50"
                                            : "border-gray-100 hover:shadow-2xl hover:scale-[1.02]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {product.name}
                                            </h3>
                                            {subscribed && (
                                                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                    {t("subscribed")}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {product.description}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm text-gray-600">{t("annualRate")} :</span>
                                                <span className="font-bold text-indigo-600 text-lg">
                                                    {format.number(product.interestRate)}%
                                                </span>
                                            </div>

                                            {product.maxDepositAmount && (
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm text-gray-600">{t("ceiling")} :</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {format.number(product.maxDepositAmount, { style: "currency", currency: "EUR" })}
                                                    </span>
                                                </div>
                                            )}

                                            {product.minDepositAmount && (
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                    <span className="text-sm text-gray-600">{t("minimum")} :</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {format.number(product.minDepositAmount, { style: "currency", currency: "EUR" })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleSubscribe(product.id)}
                                            disabled={subscribed || subscribing === product.id}
                                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${subscribed
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                                }`}
                                        >
                                            {subscribing === product.id ? (
                                                t("subscribing")
                                            ) : subscribed ? (
                                                t("alreadySubscribed")
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 inline mr-2" />
                                                    {t("subscribe")}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showDepositModal && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("depositModal.title")}</h3>
                            <p className="text-gray-600 mb-4">
                                {t("account")} #{selectedAccount}
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={t("depositModal.placeholder")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDepositModal(false);
                                        setAmount("");
                                        setSelectedAccount(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    {t("depositModal.cancel")}
                                </button>
                                <button
                                    onClick={handleDeposit}
                                    disabled={!amount || Number(amount) <= 0}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t("depositModal.confirm")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("withdrawModal.title")}</h3>
                            <p className="text-gray-600 mb-4">
                                {t("account")} #{selectedAccount}
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={t("withdrawModal.placeholder")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowWithdrawModal(false);
                                        setAmount("");
                                        setSelectedAccount(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    {t("withdrawModal.cancel")}
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!amount || Number(amount) <= 0}
                                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t("withdrawModal.confirm")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
