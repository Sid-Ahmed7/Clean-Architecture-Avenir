"use client";

import { useState, useEffect } from "react";
import { getAllSavingsProducts, subscribeToSavingsProduct, getMySavingsAccounts } from "@/lib/api/savingsProduct";
import { ArrowLeft, TrendingUp, DollarSign, Percent, CheckCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

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
    isActive: boolean;
    lastBalanceUpdate: string;
}

export default function ClientSavingsPage() {
    const router = useRouter();
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
            setMessage("Souscription réussie ! Votre livret d'épargne a été créé.");
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Erreur lors de la souscription");
        } finally {
            setSubscribing(null);
        }
    };

    const handleDeposit = async () => {
        if (!selectedAccount || !amount) return;

        try {
            const { depositToSavingsAccount } = await import("@/lib/api/savingsAccount");
            await depositToSavingsAccount(selectedAccount, Number(amount));
            setMessage(`Dépôt de ${amount}€ effectué avec succès !`);
            setShowDepositModal(false);
            setAmount("");
            setSelectedAccount(null);
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Erreur lors du dépôt");
        }
    };

    const handleWithdraw = async () => {
        if (!selectedAccount || !amount) return;

        try {
            const { withdrawFromSavingsAccount } = await import("@/lib/api/savingsAccount");
            await withdrawFromSavingsAccount(selectedAccount, Number(amount));
            setMessage(`Retrait de ${amount}€ effectué avec succès !`);
            setShowWithdrawModal(false);
            setAmount("");
            setSelectedAccount(null);
            await loadData();
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Erreur lors du retrait");
        }
    };

    const isSubscribed = (productId: string) => {
        return myAccounts.some(acc => acc.productId === productId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour</span>
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        💰 Épargne
                    </h1>
                    <p className="text-gray-600">
                        Découvrez nos produits d'épargne et faites fructifier votre argent
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.includes("réussie")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message}
                    </div>
                )}

                {/* My Savings Accounts */}
                {myAccounts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes Livrets</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myAccounts.map((account) => (
                                <div
                                    key={account.accountNumber}
                                    className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        <span className="font-bold text-gray-900">
                                            Compte #{account.accountNumber}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Solde :</span>
                                            <span className="font-bold text-gray-900 text-lg">
                                                {(account.balance ?? 0).toFixed(2)} €
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taux :</span>
                                            <span className="font-bold text-emerald-600">
                                                {account.interestRate}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Intérêts gagnés :</span>
                                            <span className="font-bold text-emerald-600">
                                                +{account.totalInterestEarned.toFixed(2)} €
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
                                            Déposer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedAccount(account.accountNumber);
                                                setShowWithdrawModal(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Produits Disponibles
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
                            <p className="text-gray-500">Aucun produit d'épargne disponible pour le moment</p>
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
                                                    ✓ Souscrit
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {product.description}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm text-gray-600">Taux annuel :</span>
                                                <span className="font-bold text-indigo-600 text-lg">
                                                    {product.interestRate}%
                                                </span>
                                            </div>

                                            {product.maxDepositAmount && (
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm text-gray-600">Plafond :</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {product.maxDepositAmount.toLocaleString('fr-FR')} €
                                                    </span>
                                                </div>
                                            )}

                                            {product.minDepositAmount && (
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                    <span className="text-sm text-gray-600">Minimum :</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {product.minDepositAmount.toLocaleString('fr-FR')} €
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
                                                "Souscription..."
                                            ) : subscribed ? (
                                                "Déjà souscrit"
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 inline mr-2" />
                                                    Souscrire
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Deposit Modal */}
                {showDepositModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Déposer de l'argent</h3>
                            <p className="text-gray-600 mb-4">
                                Compte #{selectedAccount}
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Montant (€)"
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
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeposit}
                                    disabled={!amount || Number(amount) <= 0}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdraw Modal */}
                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Retirer de l'argent</h3>
                            <p className="text-gray-600 mb-4">
                                Compte #{selectedAccount}
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Montant (€)"
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
                                    Annuler
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!amount || Number(amount) <= 0}
                                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
