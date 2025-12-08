"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSavingsAccountSchema, CreateSavingsAccountInput } from "@/lib/validation/savingsAccount/createSavingsAccountSchema";
import { createSavingsAccount } from "@/lib/api/savingsAccount";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PiggyBank, Percent, DollarSign, Calendar, Check, X, Save } from "lucide-react";

interface CreateSavingsAccountFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateSavingsAccountForm({ onSuccess, onCancel }: CreateSavingsAccountFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateSavingsAccountInput>({
        resolver: zodResolver(createSavingsAccountSchema)
    });

    const onSubmit = async (data: CreateSavingsAccountInput) => {
        try {
            setIsSubmitting(true);
            setError(null);

            await createSavingsAccount(data);

            setSuccess(true);
            reset();

            setTimeout(() => {
                setSuccess(false);
                onSuccess?.();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Erreur lors de la création du compte épargne");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Compte épargne créé !</h3>
                    <p className="text-gray-600">Le compte épargne a été créé avec succès.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <PiggyBank className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Créer un Compte Épargne</h2>
                        <p className="text-white/80 text-sm">Configurez les paramètres du compte épargne</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-900">Erreur</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Account Number */}
                <Input
                    label="Numéro de compte"
                    type="number"
                    icon={PiggyBank}
                    variant="gradient"
                    placeholder="Ex: 123456"
                    error={errors.accountNumber?.message}
                    required
                    {...register("accountNumber", { valueAsNumber: true })}
                />

                {/* Interest Rate */}
                <Input
                    label="Taux d'intérêt annuel (%)"
                    type="number"
                    step="0.01"
                    icon={Percent}
                    variant="gradient"
                    placeholder="Ex: 3.5"
                    helperText="Taux appliqué quotidiennement (divisé par 365)"
                    error={errors.interestRate?.message}
                    required
                    {...register("interestRate", { valueAsNumber: true })}
                />

                {/* Max Deposit Amount */}
                <Input
                    label="Plafond de rémunération (€)"
                    type="number"
                    step="0.01"
                    icon={DollarSign}
                    variant="gradient"
                    placeholder="Ex: 50000 (optionnel)"
                    helperText="Montant maximum qui génère des intérêts. Laissez vide pour aucune limite."
                    error={errors.maxDepositAmount?.message}
                    {...register("maxDepositAmount", {
                        setValueAs: (v) => v === "" ? null : parseFloat(v)
                    })}
                />

                {/* Maturity Date */}
                <Input
                    label="Date d'échéance"
                    type="date"
                    icon={Calendar}
                    variant="gradient"
                    helperText="Date de maturité du compte épargne (optionnel)"
                    error={errors.maturity?.message}
                    {...register("maturity", {
                        setValueAs: (v) => v ? new Date(v) : undefined
                    })}
                />

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800">
                        <strong>💡 Calcul des intérêts :</strong> Les intérêts sont calculés quotidiennement selon la formule :
                        <br />
                        <code className="bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                            min(solde, plafond) × (taux / 365 / 100)
                        </code>
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="success"
                        loading={isSubmitting}
                        icon={Save}
                        className="flex-1"
                    >
                        Créer le compte épargne
                    </Button>
                </div>
            </form>
        </div>
    );
}
