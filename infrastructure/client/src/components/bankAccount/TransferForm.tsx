"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTransferBetweenAccounts } from "@/lib/hooks/useTransferBetweenAccounts";

type TransferFormProps = {
    accounts: AccountModel[];
    onSuccess?: () => void;
};

const transferSchema = z.object({
    fromIban: z.string().min(10, "IBAN émetteur invalide"),
    toIban: z.string().min(10, "IBAN destinataire invalide"),
    amount: z
        .number({ invalid_type_error: "Montant invalide" })
        .positive("Montant invalide"),
});

type TransferModel = z.infer<typeof transferSchema>;

export default function TransferForm({ accounts, onSuccess }: TransferFormProps) {
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
        resolver: zodResolver(transferSchema),
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
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white">Effectuer un virement</h2>
                <p className="text-sm text-white/80">
                    Transfère des fonds entre tes comptes ou vers un IBAN externe.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compte émetteur
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {accounts.map((account) => (
                            <button
                                key={account.accountNumber}
                                type="button"
                                onClick={() => handleAccountSelect(account.iban)}
                                className={`border rounded-xl p-4 text-left transition-all ${
                                    selectedIban === account.iban
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        IBAN destinataire
                    </label>
                    <input
                        type="text"
                        {...register("toIban")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="FR76 3000 ..."
                    />
                    {errors.toIban && (
                        <p className="text-red-500 text-sm mt-1">{errors.toIban.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            {...register("amount", { valueAsNumber: true })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">EUR</span>
                    </div>
                    {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? "Traitement..." : "Envoyer"}
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                        Réinitialiser
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">Virement effectué avec succès.</p>}
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


