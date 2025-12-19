"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { LimitProgressBar } from "../ui/LimitProgressBar";
import { CreditCard, ArrowUpCircle, ShieldCheck, X } from "lucide-react";
import { useUpdateTransferLimit } from "@/hooks/useUpdateTransferLimit";
import { useRequestOverdraftIncrease } from "@/hooks/useRequestOverdraftIncrease";

interface  MainAccountCardProps {
    account : AccountModel;
}

export function MainAccountCard(props : MainAccountCardProps) {

    const {account} = props;
    const [currentTransferLimit, setCurrentTransferLimit] = useState(account.transferLimit);
    const [newTransferLimit, setNewTransferLimit] = useState(account.transferLimit);
    const [localError, setLocalError] = useState<string | null>(null);
    const { update, loading, error, success, resetState } = useUpdateTransferLimit();
    const [requestedOverdraft, setRequestedOverdraft] = useState(account.overdraftLimit);
    const [overdraftLocalError, setOverdraftLocalError] = useState<string | null>(null);
    const { submit, loading: overdraftLoading, error: overdraftError, success: overdraftSuccess, resetState: resetOverdraftState } = useRequestOverdraftIncrease();
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showOverdraftModal, setShowOverdraftModal] = useState(false);

    useEffect(() => {
        setCurrentTransferLimit(account.transferLimit);
        setNewTransferLimit(account.transferLimit);
        setRequestedOverdraft(account.overdraftLimit);
    }, [account.transferLimit, account.overdraftLimit]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        resetState();
        setLocalError(null);

        if (newTransferLimit <= currentTransferLimit) {
            setLocalError("The new limit must be greater than the current limit.");
            return;
        }

        update(account.accountNumber, newTransferLimit).then((isOk) => {
            if (isOk) {
                setCurrentTransferLimit(newTransferLimit);
            }
        });
    };

    const handleOverdraftSubmit = (event: FormEvent) => {
        event.preventDefault();
        resetOverdraftState();
        setOverdraftLocalError(null);

        if (requestedOverdraft <= account.overdraftLimit) {
            setOverdraftLocalError("The requested overdraft must be greater than your current overdraft.");
            return;
        }

        submit(account.accountNumber, requestedOverdraft);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-bold text-lg">
                                        {account.customAccountName || `Compte ${account.accountNumber}`}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                        Principal
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        account.isActive && account.accountStatus === 'ACTIVE'
                                            ? 'bg-green-400/90 text-green-900' 
                                            : 'bg-red-400/90 text-red-900'
                                    }`}>
                                        {account.accountStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-white/80 font-medium">Solde disponible</p>
                            <p className="text-4xl font-bold tracking-tight">
                            {account.currentBalance.toLocaleString('fr-FR')}
                            <span className="text-2xl">{account.currency}</span>

                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Numéro de compte</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {account.accountNumber.toString().padStart(11, '0')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium mb-1">IBAN</p>
                                <p className="text-sm font-mono font-semibold text-gray-900">
                                    {account.iban}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                            <h4 className="text-sm font-bold text-gray-900">Limites</h4>
                        </div>

                        <LimitProgressBar
                            label="withdrawalLimit"
                            value={0}
                            max={account.withdrawalLimit}
                            currency={account.currency}
                        />
                        <LimitProgressBar
                            label="transferLimit"
                            value={account.totalTransfered}
                            max={currentTransferLimit}
                            currency={account.currency}
                        />
                        <LimitProgressBar
                            label="overdraftLimit"
                            value={Math.abs(Math.min(0, account.currentBalance))}
                            max={account.overdraftLimit}
                            currency={account.currency}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowOverdraftModal(true)}
                                className="flex items-center gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition shadow-sm text-left"
                            >
                                <div className="p-2 rounded-full bg-purple-600 text-white">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">Demande de découvert</p>
                                    <p className="text-xs text-gray-600">
                                        Actuel : {account.overdraftLimit.toLocaleString("fr-FR")} {account.currency}
                                    </p>
                                </div>
                            </button>
                            <button
                                onClick={() => setShowTransferModal(true)}
                                className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition shadow-sm text-left"
                            >
                                <div className="p-2 rounded-full bg-blue-600 text-white">
                                    <ArrowUpCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">Augmenter limite de virement</p>
                                    <p className="text-xs text-gray-600">
                                        Actuelle : {currentTransferLimit.toLocaleString("fr-FR")} {account.currency}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showOverdraftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => {
                                resetOverdraftState();
                                setShowOverdraftModal(false);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Demander une augmentation de découvert</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Découvert actuel : {account.overdraftLimit.toLocaleString("fr-FR")} {account.currency}
                        </p>
                        <form onSubmit={handleOverdraftSubmit} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={account.overdraftLimit}
                                    step="1"
                                    value={requestedOverdraft}
                                    onChange={(event) => {
                                        const nextValue = Number(event.target.value);
                                        setRequestedOverdraft(Number.isNaN(nextValue) ? 0 : nextValue);
                                        setOverdraftLocalError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                                />
                                <span className="text-sm font-semibold text-gray-700">{account.currency}</span>
                            </div>
                            {overdraftLocalError && (
                                <p className="text-sm text-red-600">{overdraftLocalError}</p>
                            )}
                            {overdraftError && (
                                <p className="text-sm text-red-600">{overdraftError}</p>
                            )}
                            {overdraftSuccess && (
                                <p className="text-sm text-emerald-600">Demande envoyée à votre conseiller.</p>
                            )}
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetOverdraftState();
                                        setShowOverdraftModal(false);
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={overdraftLoading}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                                >
                                    {overdraftLoading ? "Envoi..." : "Demander"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTransferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => {
                                resetState();
                                setShowTransferModal(false);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Augmenter la limite de virement</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Limite actuelle : {currentTransferLimit.toLocaleString("fr-FR")} {account.currency}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={currentTransferLimit}
                                    step="1"
                                    value={newTransferLimit}
                                    onChange={(event) => {
                                        const nextValue = Number(event.target.value);
                                        setNewTransferLimit(Number.isNaN(nextValue) ? 0 : nextValue);
                                        setLocalError(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                                <span className="text-sm font-semibold text-gray-700">{account.currency}</span>
                            </div>
                            {localError && (
                                <p className="text-sm text-red-600">{localError}</p>
                            )}
                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}
                            {success && (
                                <p className="text-sm text-emerald-600">Limite mise à jour.</p>
                            )}
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetState();
                                        setShowTransferModal(false);
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                                >
                                    {loading ? "Mise à jour..." : "Augmenter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}