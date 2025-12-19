"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { TransferModel, transferSchema } from "@/lib/validation/bankAccount/transferSchema";
import { useTransferBetweenAccounts } from "@/hooks/useTransferBetweenAccounts";

type TransferFormProps = {
    accounts: AccountModel[];
    onSuccess?: () => void;
};



export default function TransferForm({ accounts, onSuccess }: TransferFormProps) {
    const t = useTranslations();
    const { transfer, loading, error, success, resetState } = useTransferBetweenAccounts();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingTransfer, setPendingTransfer] = useState<TransferModel | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TransferModel>({
        resolver: zodResolver(transferSchema(t)),
        defaultValues: {
            fromIban: accounts.length > 0 ? accounts[0].iban : "",
            toIban: "",
            amount: 0,
        },
    });

    const selectedIban = watch("fromIban");

    useEffect(() => {
        if (success) {
            reset({
                fromIban: accounts.length > 0 ? accounts[0].iban : "",
                toIban: "",
                amount: 0,
            });
            onSuccess?.();
        }
    }, [success, reset, accounts, onSuccess]);

    useEffect(() => {
        return () => {
            resetState();
        };
    }, [resetState]);

    const onSubmit = (data: TransferModel) => {
        setPendingTransfer(data);
        setShowConfirm(true);
    };

    const handleAccountSelect = (iban: string) => {
        setValue("fromIban", iban, { shouldValidate: true });
    };

    const handleConfirm = () => {
        if (!pendingTransfer) {
            return;
        }

        transfer({
            fromIban: pendingTransfer.fromIban,
            toIban: pendingTransfer.toIban,
            amount: pendingTransfer.amount,
        }).finally(() => {
            setShowConfirm(false);
            setPendingTransfer(null);
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingTransfer(null);
    };

    return (
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-7 flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">Virements</p>
                <h2 className="text-2xl font-bold text-white">Effectuer un virement</h2>
                <p className="text-sm text-white/80">
                    Déplace tes fonds en toute sécurité, entre tes comptes ou vers un IBAN externe.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-900">
                                Compte émetteur
                            </label>
                            <span className="text-xs text-gray-500">Choisis un compte à débiter</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {accounts.map((account) => (
                                <button
                                    key={account.accountNumber}
                                    type="button"
                                    onClick={() => handleAccountSelect(account.iban)}
                                    className={`rounded-2xl border p-4 text-left transition-all shadow-sm ${
                                        selectedIban === account.iban
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {account.customAccountName || `Compte ${account.accountNumber}`}
                                            </p>
                                            <p className="text-xs text-gray-500">{account.iban}</p>
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {account.currency}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-lg font-semibold text-gray-900">
                                        {account.currentBalance.toLocaleString("fr-FR")}
                                        <span className="text-sm ml-1">{account.currency}</span>
                                    </p>
                                </button>
                            ))}
                        </div>
                        <input type="hidden" value={selectedIban} {...register("fromIban")} />
                        {errors.fromIban && (
                            <p className="text-red-500 text-sm mt-1">{errors.fromIban.message}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                IBAN destinataire
                            </label>
                            <input
                                type="text"
                                {...register("toIban")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                placeholder="FR76 3000 ..."
                            />
                            {errors.toIban && (
                                <p className="text-red-500 text-sm">{errors.toIban.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Montant</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("amount", { valueAsNumber: true })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    placeholder="0.00"
                                />
                                <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 text-sm font-semibold">
                                    EUR
                                </span>
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 text-sm">{errors.amount.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 border border-dashed border-gray-200">
                            <p>Assure-toi que l’IBAN destinataire est correct avant de confirmer.</p>
                            <p>Les transferts peuvent être soumis à des vérifications supplémentaires.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 flex-wrap">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 min-w-[180px] px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
                        >
                            {loading ? "Traitement..." : "Envoyer"}
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
                            Virement effectué avec succès.
                        </div>
                    )}
                </div>
            </form>

            {showConfirm && pendingTransfer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirmer le virement</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Tu t'apprêtes à transférer
                            <span className="font-semibold text-gray-900"> {pendingTransfer.amount.toFixed(2)} EUR </span>
                            de l'IBAN
                            <span className="font-semibold text-gray-900"> {pendingTransfer.fromIban} </span>
                            vers
                            <span className="font-semibold text-gray-900"> {pendingTransfer.toIban}</span>.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                disabled={loading}
                            >
                                Oui, confirmer
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                disabled={loading}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


